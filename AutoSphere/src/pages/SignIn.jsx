import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, LockIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import logo from '../utils/images/logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(role === 'buyer' ? '/buyer' : '/vendor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-green-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="AutoSphere" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-extrabold text-slate-900">
              Auto<span className="text-green-600">Sphere</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Sign In</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, continue to your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <MailIcon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <LockIcon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <EyeIcon size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Continue As</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  role === 'buyer' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  role === 'vendor' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'
                }`}
              >
                Vendor
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" className="font-bold text-green-600 hover:text-green-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
