
import { useMemo, useState } from 'react';
import {
  SearchIcon,
  PlusCircleIcon,
  EditIcon,
  Trash2Icon,
  WrenchIcon,
  PackageIcon,
  PlusIcon,
  MinusIcon,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

const VendorInventory = () => {
  const {
    vendorProducts,
    vendorServices,
    updateProductStock,
    updateProductVariantStock,
    deleteProduct,
    deleteService,
  } = useOutletContext();
  const [activeType, setActiveType] = useState('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const sourceItems = activeType === 'product' ? vendorProducts : vendorServices;

  const categories = useMemo(() => {
    const unique = [...new Set(sourceItems.map((item) => item.category).filter(Boolean))];
    return ['All Categories', ...unique];
  }, [sourceItems]);

  const filteredItems = useMemo(() => {
    return sourceItems.filter((item) => {
      const primaryName = activeType === 'product' ? item.name : item.title;
      const secondaryCode = activeType === 'product' ? item.sku || '' : item.serviceType || '';
      const matchesSearch =
        !searchQuery.trim() ||
        `${primaryName} ${secondaryCode} ${item.category}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [activeType, categoryFilter, searchQuery, sourceItems]);

  const productCount = vendorProducts.length;
  const serviceCount = vendorServices.length;

  const getTotalStock = (product) => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
    }

    return Number(product.stock) || 0;
  };

  const totalTrackedUnits = useMemo(
    () => vendorProducts.reduce((sum, product) => sum + getTotalStock(product), 0),
    [vendorProducts]
  );
  const lowStockCount = useMemo(
    () => vendorProducts.filter((product) => getTotalStock(product) <= 5).length,
    [vendorProducts]
  );

  const getProductStockStatus = (stock) => {
    if (stock <= 0) {
      return { label: 'Out of Stock', classes: 'bg-red-100 text-red-700' };
    }

    if (stock <= 5) {
      return { label: 'Low Stock', classes: 'bg-yellow-100 text-yellow-700' };
    }

    return { label: 'In Stock', classes: 'bg-green-100 text-green-700' };
  };

  const getPublishStatusClasses = (status) => {
    return status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
  };

  const handleDelete = (id) => {
    if (activeType === 'product') {
      deleteProduct(id);
      return;
    }

    deleteService(id);
  };

  const addPath = activeType === 'product' ? '/vendor/add-product' : '/vendor/add-service';

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
           <p className="text-gray-500">Add, edit, and categorize vehicle parts and professional services.</p>
        </div>
        <Link to={addPath} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center shadow-sm transition">
          <PlusCircleIcon size={18} className="mr-2" /> {activeType === 'product' ? 'Add Product' : 'Add Service'}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            setActiveType('product');
            setCategoryFilter('All Categories');
          }}
          className={`rounded-xl border p-4 text-left transition ${
            activeType === 'product' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-200'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <PackageIcon size={18} /> Parts Catalog
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{productCount}</p>
          <p className="text-xs text-gray-500">Total listed products</p>
        </button>

        <button
          onClick={() => {
            setActiveType('service');
            setCategoryFilter('All Categories');
          }}
          className={`rounded-xl border p-4 text-left transition ${
            activeType === 'service' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-200'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <WrenchIcon size={18} /> Services Catalog
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{serviceCount}</p>
          <p className="text-xs text-gray-500">Total listed services</p>
        </button>
      </div>

      {activeType === 'product' && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tracked Items</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{productCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Units in Stock</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalTrackedUnits}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Low Stock Alerts</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{lowStockCount}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={activeType === 'product' ? 'Search by product name, SKU, or category...' : 'Search by service title, type, or category...'} 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
            />
          </div>
          <div className="flex gap-2 sm:min-w-[240px]">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">{activeType === 'product' ? 'Product Name' : 'Service Title'}</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (PKR)</th>
                <th className="px-6 py-4">{activeType === 'product' ? 'Stock' : 'Duration'}</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No {activeType === 'product' ? 'products' : 'services'} match your current filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const totalStock = activeType === 'product' ? getTotalStock(item) : 0;
                  const stockStatus = activeType === 'product' ? getProductStockStatus(totalStock) : null;
                  const editPath = activeType === 'product' ? `/vendor/add-product/${item.id}` : `/vendor/add-service/${item.id}`;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{activeType === 'product' ? item.name : item.title}</div>
                        <div className="text-xs text-gray-500">
                          {activeType === 'product' ? `SKU: ${item.sku || 'N/A'}` : item.serviceType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{Number(item.price || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {activeType === 'product' ? (
                          <div className="space-y-2">
                            {Array.isArray(item.variants) && item.variants.length > 0 ? (
                              <>
                                <div className="text-sm font-semibold text-slate-800">{totalStock} units</div>
                                <div className="rounded-lg bg-gray-50 p-2">
                                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Variant tracking
                                  </div>
                                  <div className="space-y-1.5">
                                    {item.variants.map((variant) => (
                                      <div key={variant.id} className="flex items-center justify-between gap-2 text-xs">
                                        <span className="truncate text-gray-700">{variant.label}</span>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => updateProductVariantStock(item.id, variant.id, -1)}
                                            className="rounded border border-gray-300 bg-white p-1 text-gray-600 hover:bg-gray-100"
                                            aria-label="Decrease variant stock"
                                          >
                                            <MinusIcon size={12} />
                                          </button>
                                          <span className="min-w-6 text-center font-semibold text-slate-800">{variant.stock}</span>
                                          <button
                                            onClick={() => updateProductVariantStock(item.id, variant.id, 1)}
                                            className="rounded border border-gray-300 bg-white p-1 text-gray-600 hover:bg-gray-100"
                                            aria-label="Increase variant stock"
                                          >
                                            <PlusIcon size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateProductStock(item.id, -1)}
                                  className="rounded border border-gray-300 bg-white p-1.5 text-gray-600 hover:bg-gray-100"
                                  aria-label="Decrease stock"
                                >
                                  <MinusIcon size={13} />
                                </button>
                                <span className="min-w-8 text-center font-semibold text-slate-800">{totalStock}</span>
                                <button
                                  onClick={() => updateProductStock(item.id, 1)}
                                  className="rounded border border-gray-300 bg-white p-1.5 text-gray-600 hover:bg-gray-100"
                                  aria-label="Increase stock"
                                >
                                  <PlusIcon size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          `${item.durationValue || 0} ${item.durationUnit || 'Hours'}`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center px-2 py-1 rounded-full text-xs font-bold ${getPublishStatusClasses(item.status)}`}>
                            {item.status || 'Draft'}
                          </span>
                          {activeType === 'product' && (
                            <span className={`inline-flex w-fit items-center px-2 py-1 rounded-full text-xs font-bold ${stockStatus.classes}`}>
                              {stockStatus.label}
                            </span>
                          )}
                          {activeType === 'product' && item.updatedAt && (
                            <span className="text-[10px] text-gray-400">Updated {new Date(item.updatedAt).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={editPath} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition">
                            <EditIcon size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500">
          <div>
            Showing {filteredItems.length} of {sourceItems.length} {activeType === 'product' ? 'products' : 'services'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorInventory;