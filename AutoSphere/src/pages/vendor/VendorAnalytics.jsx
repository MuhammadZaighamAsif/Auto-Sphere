import { useMemo, useState } from 'react';
import {
  TrendingUpIcon,
  UsersIcon,
  ShoppingBagIcon,
  DollarSignIcon,
  CalendarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  DownloadIcon,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Year to Date'];

const formatCurrency = (value) => `PKR ${Math.round(value).toLocaleString()}`;

const parseOrderDate = (orderDate) => {
  const parsed = new Date(orderDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getRangeWindow = (dateRange) => {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const startDate = new Date(endDate);

  if (dateRange === 'Last 7 Days') {
    startDate.setDate(endDate.getDate() - 6);
  } else if (dateRange === 'Last 30 Days') {
    startDate.setDate(endDate.getDate() - 29);
  } else if (dateRange === 'Last 3 Months') {
    startDate.setMonth(endDate.getMonth() - 3);
    startDate.setDate(startDate.getDate() + 1);
  } else {
    startDate.setMonth(0);
    startDate.setDate(1);
  }

  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
};

const getPreviousWindow = ({ startDate, endDate }) => {
  const duration = endDate.getTime() - startDate.getTime() + 1;
  const previousEnd = new Date(startDate.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - duration + 1);
  return { startDate: previousStart, endDate: previousEnd };
};

const calcTrend = (currentValue, previousValue) => {
  if (previousValue === 0 && currentValue === 0) {
    return { label: '0.0%', status: 'flat' };
  }

  if (previousValue === 0) {
    return { label: '+100.0%', status: 'up' };
  }

  const delta = ((currentValue - previousValue) / previousValue) * 100;
  const sign = delta >= 0 ? '+' : '';
  const status = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  return { label: `${sign}${delta.toFixed(1)}%`, status };
};

const getTrendBadgeClasses = (status) => {
  if (status === 'up') {
    return 'bg-green-100 text-green-700';
  }

  if (status === 'down') {
    return 'bg-red-100 text-red-700';
  }

  return 'bg-gray-100 text-gray-700';
};

const normalizeProductName = (name) => name.toLowerCase().replace(/\s+/g, ' ').trim();

const VendorAnalytics = () => {
  const { vendorOrders, vendorProducts } = useOutletContext();
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const analytics = useMemo(() => {
    const currentRange = getRangeWindow(dateRange);
    const previousRange = getPreviousWindow(currentRange);

    const paidStatuses = new Set(['Paid']);
    const countableStatuses = new Set(['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']);

    const ordersWithDate = vendorOrders
      .map((order) => ({ ...order, parsedDate: parseOrderDate(order.date) }))
      .filter((order) => order.parsedDate);

    const inWindow = (order, window) =>
      order.parsedDate >= window.startDate && order.parsedDate <= window.endDate;

    const currentOrders = ordersWithDate.filter((order) => inWindow(order, currentRange));
    const previousOrders = ordersWithDate.filter((order) => inWindow(order, previousRange));

    const currentRevenue = currentOrders
      .filter((order) => paidStatuses.has(order.paymentStatus) && order.status !== 'Cancelled')
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const previousRevenue = previousOrders
      .filter((order) => paidStatuses.has(order.paymentStatus) && order.status !== 'Cancelled')
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const currentOrderCount = currentOrders.filter((order) => countableStatuses.has(order.status)).length;
    const previousOrderCount = previousOrders.filter((order) => countableStatuses.has(order.status)).length;

    const currentCustomerCount = new Set(currentOrders.map((order) => order.email)).size;
    const previousCustomerCount = new Set(previousOrders.map((order) => order.email)).size;

    const currentAov = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;
    const previousAov = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;

    const productMap = new Map();
    const categoryMap = new Map();
    const knownProducts = vendorProducts.map((product) => ({
      ...product,
      normalizedName: normalizeProductName(product.name),
    }));

    currentOrders.forEach((order) => {
      if (order.status === 'Cancelled') {
        return;
      }

      const lineItems = String(order.items || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const perItemRevenue = lineItems.length > 0 ? (Number(order.total) || 0) / lineItems.length : Number(order.total) || 0;

      lineItems.forEach((lineItem) => {
        const normalizedLine = normalizeProductName(lineItem);
        const matchedProduct = knownProducts.find(
          (product) =>
            normalizedLine.includes(product.normalizedName) ||
            product.normalizedName.includes(normalizedLine)
        );
        const category = matchedProduct?.category || 'Uncategorized';

        const productEntry = productMap.get(lineItem) || { name: lineItem, sales: 0, revenue: 0, category };
        productEntry.sales += 1;
        productEntry.revenue += perItemRevenue;
        productMap.set(lineItem, productEntry);

        categoryMap.set(category, (categoryMap.get(category) || 0) + perItemRevenue);
      });
    });

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.sales - a.sales || b.revenue - a.revenue)
      .slice(0, 6);

    const categoryRevenueTotal = [...categoryMap.values()].reduce((sum, value) => sum + value, 0);
    const categoryPerformance = [...categoryMap.entries()]
      .map(([category, revenue]) => ({
        category,
        value: categoryRevenueTotal > 0 ? Math.round((revenue / categoryRevenueTotal) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      const revenue = ordersWithDate
        .filter(
          (order) =>
            order.parsedDate >= monthStart &&
            order.parsedDate <= monthEnd &&
            paidStatuses.has(order.paymentStatus) &&
            order.status !== 'Cancelled'
        )
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      return {
        monthLabel: monthStart.toLocaleString('en-US', { month: 'short' }),
        revenue,
      };
    });

    const maxMonthRevenue = Math.max(...monthlyRevenue.map((month) => month.revenue), 1);

    return {
      kpis: {
        revenue: {
          total: formatCurrency(currentRevenue),
          trend: calcTrend(currentRevenue, previousRevenue),
        },
        orders: {
          total: String(currentOrderCount),
          trend: calcTrend(currentOrderCount, previousOrderCount),
        },
        customers: {
          total: String(currentCustomerCount),
          trend: calcTrend(currentCustomerCount, previousCustomerCount),
        },
        aov: {
          total: formatCurrency(currentAov),
          trend: calcTrend(currentAov, previousAov),
        },
      },
      topProducts,
      categoryPerformance,
      monthlyRevenue,
      maxMonthRevenue,
      currentOrderCount,
    };
  }, [dateRange, vendorOrders, vendorProducts]);

  const renderTrendIcon = (status) => {
    if (status === 'down') {
      return <ArrowDownRightIcon size={14} className="mr-1" />;
    }

    return <ArrowUpRightIcon size={14} className="mr-1" />;
  };

  const reportContent = useMemo(() => {
    const reportDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const topCategory = analytics.categoryPerformance[0]?.category || 'N/A';
    const topCategoryShare = analytics.categoryPerformance[0]?.value || 0;
    const topProduct = analytics.topProducts[0]?.name || 'N/A';

    const productLines =
      analytics.topProducts.length === 0
        ? ['- No top products in selected period.']
        : analytics.topProducts.map(
            (product, index) =>
              `- #${index + 1} ${product.name}: ${product.sales} units | ${formatCurrency(product.revenue)}`
          );

    return [
      'AUTO SPHERE - VENDOR ANALYTICS REPORT (DUMMY)',
      `Generated On: ${reportDate}`,
      `Date Range: ${dateRange}`,
      '',
      'KPI SNAPSHOT',
      `- Revenue: ${analytics.kpis.revenue.total} (${analytics.kpis.revenue.trend.label})`,
      `- Orders: ${analytics.kpis.orders.total} (${analytics.kpis.orders.trend.label})`,
      `- Customers: ${analytics.kpis.customers.total} (${analytics.kpis.customers.trend.label})`,
      `- Avg Order Value: ${analytics.kpis.aov.total} (${analytics.kpis.aov.trend.label})`,
      '',
      'SUMMARY',
      `- Top Category: ${topCategory} (${topCategoryShare}% of category revenue)`,
      `- Top Product: ${topProduct}`,
      `- Filtered Orders Considered: ${analytics.currentOrderCount}`,
      '',
      'TOP PRODUCTS',
      ...productLines,
      '',
      'NOTE',
      '- This is a dummy auto-generated report based on currently available in-app data.',
    ].join('\n');
  }, [analytics, dateRange]);

  const downloadReport = () => {
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeRange = dateRange.toLowerCase().replace(/\s+/g, '-');

    anchor.href = objectUrl;
    anchor.download = `vendor-analytics-report-${safeRange}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="font-sans text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-gray-500">Track your store's performance and growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            >
              {DATE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <button
            onClick={downloadReport}
            className="p-2 bg-white border border-gray-300 rounded-lg text-slate-600 hover:bg-gray-50 transition"
            title="Export Report"
          >
            <DownloadIcon size={20} />
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <h3 className="text-sm font-bold text-slate-900">Dummy Report Preview</h3>
        <p className="mt-1 text-xs text-slate-600">
          This report is auto-generated from available analytics data. Use the download icon to export it.
        </p>
        <p className="mt-2 text-xs font-medium text-slate-700">
          Snapshot: {analytics.kpis.revenue.total} revenue, {analytics.kpis.orders.total} orders, {analytics.kpis.customers.total} active customers.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <DollarSignIcon size={24} />
            </div>
            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${getTrendBadgeClasses(analytics.kpis.revenue.trend.status)}`}>
              {renderTrendIcon(analytics.kpis.revenue.trend.status)}
              {analytics.kpis.revenue.trend.label}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{analytics.kpis.revenue.total}</h3>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <ShoppingBagIcon size={24} />
            </div>
            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${getTrendBadgeClasses(analytics.kpis.orders.trend.status)}`}>
              {renderTrendIcon(analytics.kpis.orders.trend.status)}
              {analytics.kpis.orders.trend.label}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{analytics.kpis.orders.total}</h3>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <UsersIcon size={24} />
            </div>
            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${getTrendBadgeClasses(analytics.kpis.customers.trend.status)}`}>
              {renderTrendIcon(analytics.kpis.customers.trend.status)}
              {analytics.kpis.customers.trend.label}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{analytics.kpis.customers.total}</h3>
          <p className="text-sm text-gray-500">Active Customers</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
              <TrendingUpIcon size={24} />
            </div>
            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${getTrendBadgeClasses(analytics.kpis.aov.trend.status)}`}>
              {renderTrendIcon(analytics.kpis.aov.trend.status)}
              {analytics.kpis.aov.trend.label}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{analytics.kpis.aov.total}</h3>
          <p className="text-sm text-gray-500">Avg. Order Value</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Trend (Mock Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {analytics.monthlyRevenue.map((entry) => {
              const height = Math.max((entry.revenue / analytics.maxMonthRevenue) * 100, 4);

              return (
                <div key={entry.monthLabel} className="w-full h-full bg-white rounded-t-sm relative group">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t-sm transition-all duration-500 group-hover:bg-green-600"
                    style={{ height: `${height}%` }}
                  ></div>

                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {formatCurrency(entry.revenue)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-around mt-4 text-xs text-gray-400 font-bold uppercase tracking-wide">
            {analytics.monthlyRevenue.map((entry) => (
              <span key={`${entry.monthLabel}-label`}>{entry.monthLabel}</span>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sales by Category</h3>
          <div className="space-y-5">
            {analytics.categoryPerformance.length === 0 ? (
              <p className="text-sm text-gray-500">No category data available for the selected range.</p>
            ) : (
              analytics.categoryPerformance.map((item) => (
                <div key={item.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.category}</span>
                  <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-slate-900">Top Performing Products</h3>
          <p className="mt-1 text-xs text-gray-500">Based on current filtered orders ({analytics.currentOrderCount} orders)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Units Sold</th>
                <th className="px-6 py-4">Total Revenue</th>
                <th className="px-6 py-4">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.topProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No product popularity data available for this period.
                  </td>
                </tr>
              ) : (
                analytics.topProducts.map((product, index) => (
                <tr key={`${product.name}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">{product.sales}</td>
                  <td className="px-6 py-4 font-medium text-green-600">{formatCurrency(product.revenue)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                      <TrendingUpIcon size={12} className="mr-1" /> Up
                    </span>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;