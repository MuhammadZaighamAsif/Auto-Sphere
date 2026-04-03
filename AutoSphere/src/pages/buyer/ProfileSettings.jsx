import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle2, X } from 'lucide-react';

const EMPTY_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  vehicle: ''
};

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { buyerProfile, createProfile, updateProfile, deleteProfile, resetProfile } = useOutletContext();

  const [formData, setFormData] = useState(
    buyerProfile
      ? {
          fullName: buyerProfile.fullName || '',
          email: buyerProfile.email || '',
          phone: buyerProfile.phone || '',
          address: buyerProfile.address || '',
          vehicle: buyerProfile.vehicle || ''
        }
      : EMPTY_PROFILE
  );

  const [popupMessage, setPopupMessage] = useState('');

  const showSuccessPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage('');
    }, 2200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (buyerProfile) {
      updateProfile(formData);
      showSuccessPopup('Profile updated successfully.');
      return;
    }

    createProfile(formData);
    showSuccessPopup('Profile created successfully.');
  };

  const handleDeleteProfile = () => {
    if (!buyerProfile) return;
    if (!window.confirm('Delete your profile? You can create it again later.')) return;

    deleteProfile();
    setFormData(EMPTY_PROFILE);
    showSuccessPopup('Profile deleted successfully.');
  };

  const handleResetDummy = () => {
    resetProfile();
    showSuccessPopup('Dummy profile restored successfully.');
    navigate('/buyer/profile');
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link to="/buyer/profile" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-4">
          <ArrowLeftIcon size={18} className="mr-2" /> Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Change Profile Settings</h1>
        <p className="mt-2 text-gray-600">Update, create, or delete your buyer profile details.</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-600">Primary Vehicle</label>
            <input
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              placeholder="e.g. Honda Civic 2019"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />
          </div>

          <div className="md:col-span-2 mt-2 flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition"
            >
              {buyerProfile ? 'Update Profile' : 'Create Profile'}
            </button>

            {buyerProfile && (
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 transition"
              >
                Delete Profile
              </button>
            )}

            {!buyerProfile && (
              <button
                type="button"
                onClick={handleResetDummy}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition"
              >
                Restore Dummy Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {popupMessage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40">
          <div className="max-w-sm w-full rounded-2xl bg-white p-6 text-center shadow-2xl animate-in zoom-in duration-200">
            <button
              onClick={() => setPopupMessage('')}
              className="ml-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close success popup"
            >
              <X size={16} />
            </button>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Success</h3>
            <p className="mt-2 text-sm text-gray-600">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
