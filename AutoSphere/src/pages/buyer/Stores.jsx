import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, FilterIcon, SearchIcon, PhoneIcon, X , ArrowLeft} from 'lucide-react';

import pic1 from '../../utils/images/download.jpeg';
import pic2 from '../../utils/images/download (1).jpeg'
import pic3 from '../../utils/images/download (2).jpeg'


const VENDORS = [
  {
    id: 1,
    name: 'Sehgal Motorsports',
    category: 'Accessories & Modifications',
    location: 'Montgomery Road, Lahore',
    rating: 4.8,
    reviews: 1240,
    image: pic3,
    tags: ['Body Kits', 'Lights', 'Interior'],
    phone: '+92 300 1234567'
  },
  {
    id: 2,
    name: 'Toyota Cantt Motors',
    category: 'Genuine Parts',
    location: 'Main Blvd, Lahore Cantt',
    rating: 4.9,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['OEM Parts', 'Oil', 'Filters'],
    phone: '+92 321 9876543'
  },
  {
    id: 3,
    name: 'Sher Shah Kabli Parts',
    category: 'Used Imported Parts',
    location: 'Sher Shah, Karachi',
    rating: 4.5,
    reviews: 2100,
    image: pic1,
    tags: ['Engines', 'Transmission', 'Body Panels'],
    phone: '+92 333 5555555'
  },
  {
    id: 4,
    name: 'Islamabad Detailing Hub',
    category: 'Car Care Services',
    location: 'G-10 Markaz, Islamabad',
    rating: 5.0,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['PPF', 'Ceramic', 'Wash'],
    phone: '+92 345 1122334'
  },
  {
    id: 5,
    name: 'AutoXperts Rawalpindi',
    category: 'Performance Tuning',
    location: 'Saddar, Rawalpindi',
    rating: 4.7,
    reviews: 420,
    image: pic2,
    tags: ['Remap', 'Exhaust', 'Suspension'],
    phone: '+92 301 7778899'
  }
];

const Stores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // State for handling the phone modal
  const [selectedVendorForCall, setSelectedVendorForCall] = useState(null);

  const filteredVendors = VENDORS.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <Link to="/buyer" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </Link>
          <h1 className="text-3xl font-bold text-slate-900">Partner Stores</h1>
          <p className="text-gray-600 mt-2">Find trusted mechanics, parts dealers, and detailing shops near you.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <input 
                type="text" 
                placeholder="Search shops or locations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           </div>
           <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
             <FilterIcon size={20} />
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={vendor.image} 
                alt={vendor.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
                <StarIcon size={14} className="text-yellow-500 fill-current mr-1" />
                <span className="text-xs font-bold text-slate-800">{vendor.rating}</span>
                <span className="text-[10px] text-gray-500 ml-1">({vendor.reviews})</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {vendor.category}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                {vendor.name}
              </h3>
              
              <div className="flex items-start text-sm text-gray-500 mb-4">
                <MapPinIcon size={16} className="mr-1.5 mt-0.5 flex-shrink-0" />
                <span>{vendor.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {vendor.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedVendorForCall(vendor)}
                  className="flex items-center justify-center py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <PhoneIcon size={16} className="mr-2" /> Call
                </button>
                <Link 
                  to={`/buyer/stores/${vendor.id}`} 
                  className="flex items-center justify-center py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call Modal Popup */}
      {selectedVendorForCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold">Contact Store</h3>
              <button 
                onClick={() => setSelectedVendorForCall(null)}
                className="hover:bg-slate-700 p-1 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedVendorForCall.name}</h4>
              <p className="text-sm text-gray-500 mb-6">Available 9:00 AM - 8:00 PM</p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
                  {selectedVendorForCall.phone}
                </p>
              </div>
              
              <button 
                onClick={() => {
                  window.location.href = `tel:${selectedVendorForCall.phone}`;
                }}
                className="w-full py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Dial Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;