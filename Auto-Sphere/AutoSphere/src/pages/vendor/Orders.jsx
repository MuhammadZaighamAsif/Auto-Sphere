import { useMemo, useState } from 'react';
import { SearchIcon, EyeIcon, TruckIcon, CheckCircleIcon } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const STATUS_TABS = ['All', 'New', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_ACTIONS = {
  New: { next: 'Processing', label: 'Accept & Process' },
  Processing: { next: 'Packed', label: 'Mark Packed' },
  Packed: { next: 'Shipped', label: 'Mark Shipped' },
  Shipped: { next: 'Out for Delivery', label: 'Out for Delivery' },
  'Out for Delivery': { next: 'Delivered', label: 'Mark Delivered' },
};

const VendorOrders = () => {
  const { vendorOrders, updateOrderStatus, updateOrderDelivery } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({ courier: '', trackingNumber: '', eta: '' });
  const [statusEmailPrompt, setStatusEmailPrompt] = useState(null);
  const [statusUpdateEmail, setStatusUpdateEmail] = useState('');
  const [statusUpdateError, setStatusUpdateError] = useState('');
  const [emailSentNotice, setEmailSentNotice] = useState('');
  const [isSendingStatusEmail, setIsSendingStatusEmail] = useState(false);

  const filteredOrders = vendorOrders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedOrder = useMemo(
    () => vendorOrders.find((order) => order.id === selectedOrderId) || null,
    [selectedOrderId, vendorOrders]
  );

  const incomingCount = vendorOrders.filter((order) => order.status === 'New').length;
  const inTransitCount = vendorOrders.filter(
    (order) => order.status === 'Shipped' || order.status === 'Out for Delivery'
  ).length;
  const deliveredTodayCount = vendorOrders.filter((order) => order.status === 'Delivered').length;

  const openOrderDetails = (order) => {
    setSelectedOrderId(order.id);
    setDeliveryForm({
      courier: order.delivery?.courier || '',
      trackingNumber: order.delivery?.trackingNumber || '',
      eta: order.delivery?.eta || '',
    });
  };

  const closeOrderDetails = () => {
    setSelectedOrderId(null);
  };

  const runNextStep = (order) => {
    const nextStep = STATUS_ACTIONS[order.status];
    if (!nextStep) {
      return;
    }

    setStatusEmailPrompt({
      orderId: order.id,
      currentStatus: order.status,
      nextStatus: nextStep.next,
    });
    setStatusUpdateEmail(order.email || '');
    setStatusUpdateError('');
  };

  const closeStatusPrompt = () => {
    if (isSendingStatusEmail) {
      return;
    }

    setStatusEmailPrompt(null);
    setStatusUpdateError('');
  };

  const openStatusEmailDraft = ({ orderId, nextStatus, recipientEmail, customerName, total }) => {
    const orderSubject = `AutoSphere Order ${orderId} - Status Updated to ${nextStatus}`;
    const orderBody = `Hello ${customerName},\n\nYour order ${orderId} status is now ${nextStatus}.\nOrder total: PKR ${Number(total || 0).toLocaleString()}\n\nThanks,\nAutoSphere Vendor Team`;
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(orderSubject)}&body=${encodeURIComponent(orderBody)}`;
    const popup = window.open(mailtoLink, '_blank');
    return popup !== null;
  };

  const sendStatusEmail = async ({ orderId, nextStatus, recipientEmail, customerName, total }) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in .env.');
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: recipientEmail,
        to_name: customerName,
        order_id: orderId,
        order_status: nextStatus,
        order_total: `PKR ${Number(total || 0).toLocaleString()}`,
        app_name: 'AutoSphere',
      },
      {
        publicKey,
      }
    );
  };

  const confirmStatusUpdateWithEmail = async () => {
    if (!statusEmailPrompt) {
      return;
    }

    const trimmedEmail = statusUpdateEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setStatusUpdateError('Please enter a valid email address to send the status update.');
      return;
    }

    const order = vendorOrders.find((item) => item.id === statusEmailPrompt.orderId);
    if (!order) {
      setStatusUpdateError('Could not find the selected order. Please try again.');
      return;
    }

    try {
      setStatusUpdateError('');
      setIsSendingStatusEmail(true);

      await sendStatusEmail({
        orderId: statusEmailPrompt.orderId,
        nextStatus: statusEmailPrompt.nextStatus,
        recipientEmail: trimmedEmail,
        customerName: order.customer,
        total: order.total,
      });

      updateOrderStatus(
        statusEmailPrompt.orderId,
        statusEmailPrompt.nextStatus,
        `Status updated to ${statusEmailPrompt.nextStatus}. Email sent to ${trimmedEmail}.`
      );

      setEmailSentNotice(
        `Order ${statusEmailPrompt.orderId} updated to ${statusEmailPrompt.nextStatus}. Email sent to ${trimmedEmail}.`
      );
      window.setTimeout(() => setEmailSentNotice(''), 3500);
      setStatusEmailPrompt(null);
    } catch (error) {
      const opened = openStatusEmailDraft({
        orderId: statusEmailPrompt.orderId,
        nextStatus: statusEmailPrompt.nextStatus,
        recipientEmail: trimmedEmail,
        customerName: order.customer,
        total: order.total,
      });

      setStatusUpdateError(
        opened
          ? 'EmailJS failed. Your email app was opened as fallback. Send manually, then retry if needed.'
          : (error?.text || error?.message || 'Could not send email update. Please try again.')
      );
    } finally {
      setIsSendingStatusEmail(false);
    }
  };

  const saveDeliveryDetails = () => {
    if (!selectedOrder) {
      return;
    }

    updateOrderDelivery(selectedOrder.id, {
      courier: deliveryForm.courier,
      trackingNumber: deliveryForm.trackingNumber,
      eta: deliveryForm.eta,
      lastUpdate: 'Delivery details updated by vendor',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Packed': return 'bg-amber-100 text-amber-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Out for Delivery': return 'bg-indigo-100 text-indigo-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="font-sans text-slate-900">
      {emailSentNotice && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {emailSentNotice}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Order Fulfillment Portal</h1>
        <p className="text-gray-500">Process incoming buyer orders and keep delivery status updated in real time.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Incoming Orders</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{incomingCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">In Transit</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{inTransitCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Delivered</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{deliveredTodayCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search order ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" 
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {STATUS_TABS.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border
                  ${filterStatus === status 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{order.id}</div>
                    <div className="text-xs text-gray-500">{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="truncate text-slate-700">{order.items}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    PKR {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-xs font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : order.paymentStatus === 'Refunded' ? 'text-red-600' : 'text-orange-600'}`}>
                       {order.paymentStatus}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition"
                        title="View Details"
                      >
                        <EyeIcon size={18} />
                      </button>

                      {STATUS_ACTIONS[order.status] && (
                        <button
                          onClick={() => runNextStep(order)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-gray-50"
                          title={STATUS_ACTIONS[order.status].label}
                        >
                          {order.status === 'Packed' || order.status === 'Shipped' ? <TruckIcon size={14} /> : <CheckCircleIcon size={14} />}
                          {STATUS_ACTIONS[order.status].label}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p>No orders found matching your criteria.</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500">
          <div>Showing {filteredOrders.length} orders</div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedOrder.id} Fulfillment</h2>
                <p className="text-xs text-gray-500">{selectedOrder.customer} • {selectedOrder.email}</p>
              </div>
              <button onClick={closeOrderDetails} className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                Close
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current Status</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{selectedOrder.status}</p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order Items</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedOrder.items}</p>
                  <p className="mt-2 text-sm font-bold text-slate-900">PKR {selectedOrder.total.toLocaleString()}</p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Status Timeline</p>
                  <div className="space-y-2">
                    {(selectedOrder.statusHistory || []).slice(0, 4).map((entry, index) => (
                      <div key={`${entry.status}-${index}`} className="text-xs text-gray-600">
                        <p className="font-semibold text-slate-700">{entry.status}</p>
                        <p>{entry.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Delivery Update</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Courier</label>
                  <input
                    value={deliveryForm.courier}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, courier: event.target.value }))}
                    placeholder="TCS / Leopards"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Tracking Number</label>
                  <input
                    value={deliveryForm.trackingNumber}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, trackingNumber: event.target.value }))}
                    placeholder="e.g. TCS998877"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Estimated Delivery Date</label>
                  <input
                    value={deliveryForm.eta}
                    onChange={(event) => setDeliveryForm((prev) => ({ ...prev, eta: event.target.value }))}
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  onClick={saveDeliveryDetails}
                  className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                >
                  Save Delivery Details
                </button>

                {STATUS_ACTIONS[selectedOrder.status] && (
                  <button
                    onClick={() => runNextStep(selectedOrder)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-gray-50"
                  >
                    {STATUS_ACTIONS[selectedOrder.status].label}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {statusEmailPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-900">Send Status Update Email</h3>
              <p className="mt-1 text-xs text-gray-500">
                {statusEmailPrompt.currentStatus} to {statusEmailPrompt.nextStatus}
              </p>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Recipient Email</label>
                <input
                  value={statusUpdateEmail}
                  onChange={(event) => setStatusUpdateEmail(event.target.value)}
                  type="email"
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              {statusUpdateError && <p className="text-xs font-medium text-red-600">{statusUpdateError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
              <button
                onClick={closeStatusPrompt}
                disabled={isSendingStatusEmail}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdateWithEmail}
                disabled={isSendingStatusEmail}
                className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700"
              >
                {isSendingStatusEmail ? 'Sending...' : 'Send Email & Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;