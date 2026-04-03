import { useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, WrenchIcon, ArrowLeftIcon, PencilIcon, Trash2Icon, X } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

const STATUS_OPTIONS = ['Confirmed', 'Rescheduled', 'Completed', 'Cancelled'];

const Appointment = () => {
  const { appointments, updateAppointment, deleteAppointment } = useOutletContext();
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    status: 'Confirmed'
  });

  const openEditModal = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      status: appointment.status || 'Confirmed'
    });
  };

  const closeEditModal = () => {
    setEditingAppointment(null);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!editingAppointment) return;

    updateAppointment(editingAppointment.id, {
      date: formData.date,
      time: formData.time,
      status: formData.status
    });

    closeEditModal();
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (!window.confirm('Delete this appointment? This action cannot be undone.')) {
      return;
    }
    deleteAppointment(appointmentId);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      case 'Rescheduled':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link to="/buyer/services" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-4">
          <ArrowLeftIcon size={18} className="mr-2" /> Back to Services
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
        <p className="text-gray-600 mt-2">View all your booked automotive service appointments.</p>
        {appointments.length > 0 && (
          <Link
            to="/buyer/services"
            className="mt-4 inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition"
          >
            Book New Appointment
          </Link>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <CalendarIcon size={40} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h2>
          <p className="text-gray-500 mb-6">Book a service appointment to see it listed here.</p>
          <Link to="/buyer/services" className="inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={appointment.image}
                    alt={appointment.title}
                    className="h-16 w-16 rounded-lg object-cover border border-gray-100"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{appointment.title}</h3>
                    <p className="text-sm text-green-700 font-semibold mt-1 flex items-center">
                      <WrenchIcon size={14} className="mr-1.5" /> {appointment.provider}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <MapPinIcon size={14} className="mr-1.5" /> {appointment.location}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-bold ${getStatusClassName(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-sm">
                  <p className="text-gray-500">Date</p>
                  <p className="font-semibold text-slate-900 flex items-center mt-1">
                    <CalendarIcon size={14} className="mr-1.5" /> {appointment.date}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Time</p>
                  <p className="font-semibold text-slate-900 flex items-center mt-1">
                    <ClockIcon size={14} className="mr-1.5" /> {appointment.time}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Starting Price</p>
                  <p className="font-semibold text-slate-900 mt-1">Rs. {appointment.priceStart.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openEditModal(appointment)}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-green-500 hover:text-green-700 transition"
                >
                  <PencilIcon size={14} className="mr-1.5" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteAppointment(appointment.id)}
                  className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                >
                  <Trash2Icon size={14} className="mr-1.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
              <div>
                <h3 className="text-lg font-bold">Edit Appointment</h3>
                <p className="text-xs text-slate-300 mt-1">Update your booking details.</p>
              </div>
              <button onClick={closeEditModal} className="rounded-full p-1 hover:bg-slate-700 transition" aria-label="Close edit modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveChanges} className="p-5 space-y-4">
              <div>
                <label htmlFor="appointment-date" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">
                  Date
                </label>
                <input
                  id="appointment-date"
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="e.g. 25 Nov"
                  required
                />
              </div>

              <div>
                <label htmlFor="appointment-time" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">
                  Time
                </label>
                <input
                  id="appointment-time"
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="e.g. 10:00 AM"
                  required
                />
              </div>

              <div>
                <label htmlFor="appointment-status" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">
                  Status
                </label>
                <select
                  id="appointment-status"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
