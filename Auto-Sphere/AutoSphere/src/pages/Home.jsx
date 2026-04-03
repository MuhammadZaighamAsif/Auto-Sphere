import { Link } from 'react-router-dom';
import { StoreIcon, ShoppingBagIcon, ChevronRightIcon, ShieldCheckIcon, ZapIcon, LockIcon } from 'lucide-react';
import logo from '../utils/images/logo.png'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 font-sans">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="container py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img src={logo} alt="autospherelogo" className="h-8 w-10 sm:h-10 sm:w-12 object-contain" />
              <h1 className="text-lg sm:text-2xl font-thin text-black leading-none">Auto <span className="text-green-500">Sphere</span></h1>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/sign-up"
                className="rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Sign Up
              </Link>
              <Link
                to="/sign-in"
                className="rounded-lg bg-green-600 px-3 sm:px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8">
        <section className="py-17 mt-7 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-slate-900">
            The Ultimate <span className="text-green-600">Auto Parts</span>{' '}
            Marketplace
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Connect with trusted stores to find genuine parts, or list your 
            inventory on Pakistan's premium auto platform.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
            {/* Buyer Card */}
            <Link to="/buyer" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md mx-auto w-full hover:border-green-600 hover:shadow-lg transition group">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBagIcon size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">I am a Buyer</h2>
              <p className="text-gray-600 mb-6 text-center">
                Browse extensive collections of parts, compare prices, 
                and find the perfect upgrade for your ride.
              </p>
              <div className="flex items-center text-green-600 font-bold group-hover:text-green-700 transition-colors">
                Explore Store <ChevronRightIcon size={20} className="ml-2" />
              </div>
            </Link>

            {/* Vendor Card */}
            <Link to="/vendor" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md mx-auto w-full hover:border-slate-800 hover:shadow-lg transition group">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <StoreIcon size={32} className="text-slate-800" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">I am a Vendor</h2>
              <p className="text-gray-600 mb-6 text-center">
                List your inventory, manage your shop, and connect with 
                thousands of car enthusiasts efficiently.
              </p>
              <div className="flex items-center text-slate-800 font-bold group-hover:text-slate-900 transition-colors">
                Sell Parts <ChevronRightIcon size={20} className="ml-2" />
              </div>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white rounded-xl shadow-sm my-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Why Choose AutoSphere?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers unparalleled features for both buyers and shop owners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Verified Stores</h3>
              <p className="text-gray-600">
                All our vendors are thoroughly vetted to ensure quality and authenticity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ZapIcon className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant notifications on price changes, new stock, and order status.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockIcon className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Secure Transactions</h3>
              <p className="text-gray-600">
                Our platform ensures safe and secure transactions for all parties involved.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <StoreIcon size={24} className="text-green-500" />
                <h3 className="text-xl font-bold">AutoSphere</h3>
              </div>
              <p className="text-gray-400">
                The premier marketplace for automobile parts and enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/buyer" className="text-gray-400 hover:text-green-400 transition">For Buyers</Link>
                </li>
                <li>
                  <Link to="/vendor" className="text-gray-400 hover:text-green-400 transition">For Vendors</Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {/* Social Icon Placeholder */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {/* Social Icon Placeholder */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>© 2025 AutoSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;