
import { Link } from 'react-router-dom';
import { 
  MapPinIcon,
  WrenchIcon, 
  ShoppingBagIcon, 
  HammerIcon, 
  StoreIcon,
  StarIcon,
  ShieldCheckIcon, 
  TruckIcon, 
  ChevronRightIcon, 
} from 'lucide-react';


import pic1 from '../../utils/images/download.jpeg';
import pic3 from '../../utils/images/download (2).jpeg'

const AVAILABLE_STORES = [
  {
    id: 1,
    name: 'Sehgal Motorsports',
    category: 'Accessories & Modifications',
    location: 'Montgomery Road, Lahore',
    rating: 4.8,
    reviews: 1240,
    image: pic3
  },
  {
    id: 2,
    name: 'Toyota Cantt Motors',
    category: 'Genuine Parts',
    location: 'Main Blvd, Lahore Cantt',
    rating: 4.9,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    name: 'Islamabad Detailing Hub',
    category: 'Car Care Services',
    location: 'G-10 Markaz, Islamabad',
    rating: 5.0,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    name: 'AutoXperts Rawalpindi',
    category: 'Performance Tuning',
    location: 'Saddar, Rawalpindi',
    rating: 4.7,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
  }
];

const BuyerDashboard = () => {
  const sectionContainerClass = 'bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100';

  const categories = [
    {
      name: 'Performance Parts',
      icon: pic1,
      count: '1,200+ Items',
      targetCategory: 'Maintenance'
    }, 
    {
      name: 'Rims & Tyres',
      icon: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=800&q=80',
      count: '850+ Sets',
      targetCategory: 'Tyres'
    }, 
    {
      name: 'Body Kits',
      icon: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
      count: '430+ Kits',
      targetCategory: 'Exterior'
    }, 
    {
      name: 'Car Care',
      icon: pic3,
      count: 'Shampoos & Wax',
      targetCategory: 'Maintenance'
    }
  ];

  // Popular brands in Pakistan context
  const brands = [
    { name: 'Toyota Genuine', logo: '#' },
    { name: 'Honda', logo: '#' },
    { name: 'Suzuki', logo: '#' },
    { name: 'Sehgal', logo: '#' }, 
    { name: 'Yokohama', logo: '#' },
    { name: 'Liqui Moly', logo: '#' }
  ];

  return (
    <div className="container py-5 sm:py-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg group">
        <img 
          src="https://images.unsplash.com/photo-1597762694773-677a2846872a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Workshop" 
          className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/75 to-slate-900/35 sm:to-transparent flex items-center">
          <div className="px-4 sm:px-8 md:px-16 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-green-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4">
              Pakistan's #1 Auto Store
            </span>
            <h1 className="text-[1.7rem] sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Upgrade Your <br/> <span className="text-green-500">Ride Today</span>
            </h1>
            <p className="text-gray-200 text-sm sm:text-lg mb-5 sm:mb-8 max-w-lg">
              From Lahore to Khyber. Get genuine parts, accessories, and expert modification services delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/buyer/parts" className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center">
                <ShoppingBagIcon size={20} className="mr-2" /> Shop Accessories
              </Link>
              <Link to="/buyer/services" className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-gray-100 transition flex items-center justify-center">
                <WrenchIcon size={20} className="mr-2" /> Find Mechanics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Brands Row */}
      <div className="mb-12">
        {/* Categories Grid */}
        <div className={sectionContainerClass}>
           <div className="mb-5 flex items-center justify-between gap-3">
             <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Browse by Category</h2>
             <Link to="/buyer/categories" className="shrink-0 text-green-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/buyer/parts?category=${encodeURIComponent(category.targetCategory)}`}
                className="relative h-32 rounded-lg overflow-hidden group cursor-pointer shadow-sm block"
              >
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{category.name}</h3>
                  <p className="text-gray-300 text-xs">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Brands */}
        {/* <div className="lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Trusted Brands</h2>
          <div className="grid grid-cols-2 gap-3">
            {brands.map((brand, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer group">
                <div className="w-full h-8 flex items-center justify-center mb-1">

                   <span className="font-bold text-slate-600 group-hover:text-green-700 text-sm text-center">{brand.name}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            View All Brands
          </button>
        </div> */}
      </div>

      {/* Available Stores */}
      <div className={`${sectionContainerClass} mb-12`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Available Stores</h2>
          <Link to="/buyer/stores" className="shrink-0 text-green-600 text-sm sm:text-base font-medium flex items-center hover:text-green-700">
            View All <ChevronRightIcon size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVAILABLE_STORES.map((store) => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Store
                </span>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{store.category}</p>
                   <h3 className="font-bold text-base text-slate-900 group-hover:text-green-600 transition-colors line-clamp-2 h-12 leading-tight">
                     {store.name}
                   </h3>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-3 bg-gray-50 p-1.5 rounded">
                  <MapPinIcon size={12} className="mr-1.5" />
                  <span className="truncate">{store.location}</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                   <div className="mb-3 flex items-center text-sm font-semibold text-slate-700">
                     <StarIcon size={14} className="mr-1.5 text-yellow-500 fill-current" />
                     {store.rating} <span className="ml-1 text-xs text-gray-500">({store.reviews} reviews)</span>
                   </div>
                   <Link
                     to={`/buyer/stores/${store.id}`}
                     className="flex w-full items-center justify-center rounded-lg bg-green-50 py-2 text-sm font-bold text-green-700 transition-colors hover:bg-green-100"
                   >
                     <StoreIcon size={14} className="mr-1.5" /> Visit Store
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Props Section */}
      <div className="bg-white p-5 sm:p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Why AutoSphere?</h2>
          <p className="text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Your one-stop solution for JDMs, PKDM upgrades, and reliable maintenance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <ShieldCheckIcon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">100% Genuine Parts</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We guarantee authenticity. No "Kabli" risks, only verified imported and local genuine parts.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <HammerIcon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Certified Workshops</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Book appointments with top-rated mechanics in Lahore, Karachi, and Islamabad.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <TruckIcon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Nationwide Delivery</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cash on delivery available. Fast shipping to all major cities across Pakistan via TCS/Leopards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;