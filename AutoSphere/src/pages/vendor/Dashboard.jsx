import { Link } from 'react-router-dom';
import { 
  PackageIcon, 
  TrendingUpIcon, 
  AlertCircleIcon, 
  ShoppingBagIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  WrenchIcon,
} from 'lucide-react';

const RECENT_ORDERS = [
  { id: '#ORD-9921', item: 'Civic X RS Turbo Headlights', customer: 'Ali Khan', date: '2 mins ago', amount: '45,000', status: 'New' },
  { id: '#ORD-9920', item: 'Toyota Grande Body Kit', customer: 'Omer Riaz', date: '1 hour ago', amount: '85,000', status: 'Processing' },
  { id: '#ORD-9919', item: 'Havoline 5W-30 Oil (x4)', customer: 'Bilal Ahmed', date: '3 hours ago', amount: '12,500', status: 'Shipped' },
  { id: '#ORD-9918', item: 'Universal Carbon Spoiler', customer: 'Saad Malik', date: '5 hours ago', amount: '18,000', status: 'Delivered' },
];

const LOW_STOCK_ITEMS = [
  { name: 'HKS Exhaust Muffler', stock: 2 },
  { name: 'Corolla 2018 Fog Lamps', stock: 1 },
  { name: 'Brembo Brake Pads (Civic)', stock: 3 },
];

const VendorDashboard = () => {
  return (
    <div className="font-sans text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Store Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening at your store today.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Revenue', value: 'PKR 1.2M', sub: '+12% from last month', icon: TrendingUpIcon, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Total Orders', value: '156', sub: '24 pending processing', icon: ShoppingBagIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Products in Stock', value: '1,402', sub: 'across 14 categories', icon: PackageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Low Stock Alerts', value: '8', sub: 'Restock recommended', icon: AlertCircleIcon, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {i === 3 && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-400 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900">Recent Orders</h3>
            <Link to="/vendor/orders" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center">
              View All <ChevronRightIcon size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount (PKR)</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{order.item}</div>
                      <div className="text-xs text-gray-500">{order.id} • {order.date}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${order.status === 'New' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alerts & Quick Actions */}
        <div className="space-y-6">
           
           {/* Quick Actions Panel - UPDATED with Add Service */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="font-bold text-lg text-slate-900 mb-4">Quick Actions</h3>
             <div className="space-y-3">
               <Link to="/vendor/add-product" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition hover:border-green-200 group">
                 <div className="bg-green-50 p-2 rounded-lg mr-3 group-hover:bg-green-100 transition">
                    <PlusCircleIcon size={20} className="text-green-600" />
                 </div>
                 <div className="text-sm font-medium text-slate-700">Add New Product</div>
               </Link>

               {/* New Add Service Button */}
               <Link to="/vendor/add-service" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition hover:border-purple-200 group">
                 <div className="bg-purple-50 p-2 rounded-lg mr-3 group-hover:bg-purple-100 transition">
                    <WrenchIcon size={20} className="text-purple-600" />
                 </div>
                 <div className="text-sm font-medium text-slate-700">Add New Service</div>
               </Link>

             </div>
           </div>

           {/* Low Stock Alert */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center gap-2 mb-4">
               <AlertCircleIcon size={20} className="text-red-500" />
               <h3 className="font-bold text-lg text-slate-900">Low Stock Alerts</h3>
             </div>
             <div className="space-y-3">
               {LOW_STOCK_ITEMS.map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                   <span className="text-sm font-medium text-slate-700">{item.name}</span>
                   <span className="text-xs font-bold text-red-600 bg-white px-2 py-1 rounded border border-red-200">
                     {item.stock} left
                   </span>
                 </div>
               ))}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;