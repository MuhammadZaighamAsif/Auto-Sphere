import { Link, useOutletContext } from 'react-router-dom';
import { ArrowLeftIcon, MailIcon, PhoneIcon, MapPinIcon, CarIcon, UserCircle2 } from 'lucide-react';

const Profile = () => {
  const { buyerProfile } = useOutletContext();

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/buyer" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-4">
            <ArrowLeftIcon size={18} className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Review your buyer information and account details.</p>
        </div>

        <Link
          to="/buyer/profile-settings"
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition"
        >
          Change Profile Settings
        </Link>
      </div>

      {!buyerProfile ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <UserCircle2 size={44} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Available</h2>
          <p className="text-gray-500 mb-6">Create your profile from settings to get started.</p>
          <Link
            to="/buyer/profile-settings"
            className="inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition"
          >
            Create Profile
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold text-xl">
              {buyerProfile.fullName
                .split(' ')
                .map((name) => name[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{buyerProfile.fullName}</h2>
              <p className="text-sm text-gray-500">Buyer Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Email</p>
              <p className="text-sm font-semibold text-slate-900 flex items-center">
                <MailIcon size={14} className="mr-2 text-green-700" /> {buyerProfile.email}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Phone</p>
              <p className="text-sm font-semibold text-slate-900 flex items-center">
                <PhoneIcon size={14} className="mr-2 text-green-700" /> {buyerProfile.phone}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Address</p>
              <p className="text-sm font-semibold text-slate-900 flex items-center">
                <MapPinIcon size={14} className="mr-2 text-green-700" /> {buyerProfile.address}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Primary Vehicle</p>
              <p className="text-sm font-semibold text-slate-900 flex items-center">
                <CarIcon size={14} className="mr-2 text-green-700" /> {buyerProfile.vehicle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
