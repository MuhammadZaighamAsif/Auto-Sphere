import { useEffect, useMemo, useState } from 'react';
import { Package, Truck, CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

const VENDOR_ORDERS_STORAGE_KEY = 'autosphere_vendor_orders';
const TRACKING_FLOW = ['New', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const parseVendorOrders = () => {
  try {
    const raw = localStorage.getItem(VENDOR_ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const getStepIcon = (stepTitle) => {
  switch (stepTitle) {
    case 'New':
      return Package;
    case 'Processing':
      return Clock;
    case 'Packed':
      return Package;
    case 'Shipped':
      return Truck;
    case 'Out for Delivery':
      return MapPin;
    case 'Delivered':
      return CheckCircle;
    default:
      return Package;
  }
};

const TrackOrder = () => {
  const { confirmedOrderItems } = useOutletContext();
  const [vendorOrders, setVendorOrders] = useState(() => parseVendorOrders());
  const totalItems = confirmedOrderItems.reduce((sum, item) => sum + item.quantity, 0);
  const firstItemName = confirmedOrderItems[0]?.name || 'No confirmed order yet';

  useEffect(() => {
    const syncOrders = () => {
      setVendorOrders(parseVendorOrders());
    };

    syncOrders();
    const intervalId = window.setInterval(syncOrders, 2000);
    const onStorage = () => syncOrders();
    window.addEventListener('storage', onStorage);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const activeOrder = useMemo(() => {
    if (!vendorOrders.length) {
      return null;
    }

    // Show latest non-cancelled order first, fallback to latest order.
    const nonCancelled = vendorOrders.find((order) => order.status !== 'Cancelled');
    return nonCancelled || vendorOrders[0];
  }, [vendorOrders]);

  const statusHistoryLookup = useMemo(() => {
    if (!activeOrder || !Array.isArray(activeOrder.statusHistory)) {
      return new Set();
    }

    return new Set(activeOrder.statusHistory.map((entry) => entry.status));
  }, [activeOrder]);

  const currentStepIndex = useMemo(() => {
    if (!activeOrder) {
      return -1;
    }

    return TRACKING_FLOW.indexOf(activeOrder.status);
  }, [activeOrder]);

  const timelineSteps = useMemo(() => {
    return TRACKING_FLOW.map((title, index) => {
      const statusFromHistory = statusHistoryLookup.has(title);
      let stepState = 'pending';

      if (statusFromHistory || index < currentStepIndex) {
        stepState = 'completed';
      }

      if (index === currentStepIndex) {
        stepState = 'active';
      }

      const relatedHistory = activeOrder?.statusHistory?.find((entry) => entry.status === title);

      return {
        id: index + 1,
        title,
        status: stepState,
        date: relatedHistory ? new Date(relatedHistory.time).toLocaleString() : 'Pending',
        description:
          title === 'Shipped' && activeOrder?.delivery?.trackingNumber
            ? `Courier: ${activeOrder.delivery.courier || 'Assigned'} (Tracking # ${activeOrder.delivery.trackingNumber})`
            : relatedHistory?.note || '',
        icon: getStepIcon(title),
      };
    });
  }, [activeOrder, currentStepIndex, statusHistoryLookup]);

  const statusChipClass =
    activeOrder?.status === 'Delivered'
      ? 'bg-green-100 text-green-700'
      : activeOrder?.status === 'Cancelled'
        ? 'bg-red-100 text-red-700'
        : 'bg-blue-100 text-blue-700';

  const displayOrderId = activeOrder?.id || 'N/A';
  const displayItemSummary = activeOrder?.items || firstItemName;
  const displayItemCount = totalItems > 0 ? totalItems : activeOrder ? 1 : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/buyer" className="flex items-center text-gray-500 hover:text-green-600 mb-6 transition">
        <ArrowLeft size={18} className="mr-2" /> Back to Shopping
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Order {displayOrderId}</h1>
            <p className="text-sm text-gray-500">{displayItemSummary} • {displayItemCount} Item{displayItemCount === 1 ? '' : 's'}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${activeOrder ? statusChipClass : 'bg-gray-100 text-gray-600'}`}>
            {activeOrder ? activeOrder.status : 'No active order'}
          </span>
        </div>

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">Items in This Order</h2>
          {confirmedOrderItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              No confirmed order yet. Add parts to cart and confirm checkout to see them here.
            </div>
          ) : (
            <div className="space-y-3">
              {confirmedOrderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3">
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover border border-gray-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.make} • {item.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-green-700">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="p-8">
          {activeOrder?.delivery?.trackingNumber && (
            <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-700">
              Tracking #: <span className="font-bold">{activeOrder.delivery.trackingNumber}</span>
              {activeOrder.delivery.courier ? ` via ${activeOrder.delivery.courier}` : ''}
              {activeOrder.delivery.eta ? ` • ETA: ${activeOrder.delivery.eta}` : ''}
            </div>
          )}

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200" />

            <div className="space-y-8">
              {timelineSteps.map((step) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <div key={step.id} className="relative flex items-start gap-6 group">
                    {/* Icon Bubble */}
                    <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                      ${isCompleted ? 'bg-green-600 border-green-100 text-white' : 
                        isActive ? 'bg-white border-green-600 text-green-600 shadow-lg' : 
                        'bg-gray-100 border-white text-gray-400'}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pt-2 ${step.status === 'pending' ? 'opacity-50' : ''}`}>
                      <h3 className={`font-bold ${isActive ? 'text-green-700' : 'text-slate-900'}`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                      {step.description && (
                        <p className="text-sm text-slate-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;