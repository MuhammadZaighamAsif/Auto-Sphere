import { useEffect, useRef, useState } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, LockIcon, SaveIcon } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const StoreSettings = () => {
  const { vendorProfile, updateVendorProfile, changeVendorPassword } = useOutletContext();
  const logoInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState(vendorProfile);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    setProfileForm(vendorProfile);
  }, [vendorProfile]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileError('');
    setProfileSuccess('');
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setProfileError('Please upload a valid image file.');
      event.target.value = '';
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setProfileError('Logo size must be 5MB or less.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((prev) => ({ ...prev, logoUrl: String(reader.result || '') }));
      setProfileError('');
      setProfileSuccess('Logo selected. Click Save Changes to apply.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSaveProfile = () => {
    const requiredFields = ['storeName', 'ownerName', 'email', 'phone', 'address'];
    const hasEmpty = requiredFields.some((field) => !String(profileForm[field] || '').trim());

    if (hasEmpty) {
      setProfileError('Please fill all profile fields before saving.');
      setProfileSuccess('');
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(profileForm.email).trim());
    if (!emailIsValid) {
      setProfileError('Please enter a valid email address.');
      setProfileSuccess('');
      return;
    }

    updateVendorProfile({
      storeName: String(profileForm.storeName).trim(),
      ownerName: String(profileForm.ownerName).trim(),
      email: String(profileForm.email).trim(),
      phone: String(profileForm.phone).trim(),
      address: String(profileForm.address).trim(),
      logoUrl: profileForm.logoUrl || '',
    });

    setProfileError('');
    setProfileSuccess('Store profile updated successfully.');
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleUpdatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all password fields.');
      setPasswordSuccess('');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      setPasswordSuccess('');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      setPasswordSuccess('');
      return;
    }

    const result = changeVendorPassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordError(result.message);
      setPasswordSuccess('');
      return;
    }

    setPasswordError('');
    setPasswordSuccess(result.message);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Store Settings</h1>
        <p className="text-gray-500">Manage your store profile and security.</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon size={20} className="text-green-600" />
              Profile Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">Update your public store details.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {profileForm.logoUrl ? (
                <img
                  src={profileForm.logoUrl}
                  alt="Store logo"
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {String(profileForm.storeName || 'VS')
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join('') || 'VS'}
                </div>
              )}
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50"
                >
                  Change Logo
                </button>
                <p className="text-xs text-gray-400 mt-2">Recommended size: 400x400px</p>
              </div>
            </div>

            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            {profileSuccess && <p className="text-sm text-green-600">{profileSuccess}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={profileForm.storeName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={profileForm.ownerName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <MailIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <PhoneIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Store Address</label>
                <div className="relative">
                  <MapPinIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center ml-auto"
            >
              <SaveIcon size={18} className="mr-2" /> Save Changes
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LockIcon size={20} className="text-red-600" />
              Security
            </h2>
            <p className="text-sm text-gray-500 mt-1">Update your password and security settings.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
            <div className="pt-4">
               <button
                 type="button"
                 onClick={handleUpdatePassword}
                 className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50"
               >
                 Update Password
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoreSettings;