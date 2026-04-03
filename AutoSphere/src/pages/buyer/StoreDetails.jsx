import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Phone, Clock, 
  CheckCircle, Map, Share2, Heart 
} from 'lucide-react';


import pic1 from '../../utils/images/download.jpeg';
import pic2 from '../../utils/images/download (1).jpeg'
import pic3 from '../../utils/images/download (2).jpeg'

const VENDORS_DETAILED = [
  {
    id: 1,
    name: 'Sehgal Motorsports',
    category: 'Accessories & Modifications',
    location: 'Montgomery Road, Lahore',
    rating: 4.8,
    reviews: 1240,
    image: pic3,
    tags: ['Body Kits', 'Lights', 'Interior'],
    phone: '+92 300 1234567',
    description: 'Pakistan’s largest car accessories and modification store. We specialize in facelift conversions, premium body kits, LED lighting upgrades, and high-end interior detailing. Trusted by thousands of car enthusiasts since 2005.',
    hours: '10:00 AM - 9:00 PM',
    features: ['Installation Service', 'Imported Parts', 'Warranty', 'Waiting Area', 'Credit Card Accepted']
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
    phone: '+92 321 9876543',
    description: 'Authorized dealership providing 100% genuine Toyota parts and lubricants. We stock parts for all local and imported Toyota models. Expert consultation available for engine parts.',
    hours: '9:00 AM - 6:00 PM',
    features: ['Authorized Dealer', 'Genuine Guarantee', 'Return Policy', 'Bulk Orders']
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
    phone: '+92 333 5555555',
    description: 'The hub of imported (Kabli) car parts in Karachi. We source engines, transmissions, and body panels directly from Japan. Best prices guaranteed for complete half-cuts and nose cuts.',
    hours: '8:00 AM - 8:00 PM',
    features: ['Testing Warranty', 'Delivery Available', 'Japan Imported', 'Wholesale Rates']
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
    phone: '+92 345 1122334',
    description: 'Premium auto detailing studio offering Ceramic Coating, Paint Protection Film (PPF), and high-end interior restoration. We use imported chemicals like Meguiars and Chemical Guys.',
    hours: '11:00 AM - 10:00 PM',
    features: ['Climate Controlled Studio', 'Certified Detailers', 'Premium Products', 'Lounge']
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
    phone: '+92 301 7778899',
    description: 'Performance tuning experts. We offer ECU remapping, custom exhaust fabrication, and suspension upgrades (Coilovers/Lowering springs) for Honda Civic, Toyota Corolla, and German cars.',
    hours: '10:30 AM - 9:30 PM',
    features: ['Dyno Testing', 'Custom Fabrication', 'Performance Parts', 'Consultation']
  }
];

const StoreDetails = () => {
  const { id } = useParams();
  const vendor = VENDORS_DETAILED.find(v => v.id === Number(id));

  if (!vendor) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Store Not Found</h2>
        <Link to="/buyer/stores" className="text-green-600 hover:underline mt-4 inline-block">
          Go back to stores
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Link to="/buyer/stores" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft size={18} className="mr-2" /> Back to Stores
      </Link>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-64 md:h-80 w-full relative">
          <img 
            src={vendor.image} 
            alt={vendor.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:left-8 text-white">
             <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                {vendor.category}
             </span>
             <h1 className="text-3xl md:text-4xl font-bold mb-2">{vendor.name}</h1>
             <div className="flex items-center text-white/90">
                <MapPin size={18} className="mr-1.5" />
                <span className="mr-4">{vendor.location}</span>
                <Star size={18} className="text-yellow-400 fill-current mr-1.5" />
                <span className="font-bold">{vendor.rating}</span>
                <span className="ml-1 opacity-75">({vendor.reviews} Reviews)</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About the Store</h2>
            <p className="text-gray-600 leading-relaxed">
              {vendor.description}
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Store Features</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vendor.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-600 text-sm">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* Tags/Categories */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h2 className="text-xl font-bold text-slate-900 mb-4">Specialties</h2>
             <div className="flex flex-wrap gap-2">
                {vendor.tags.map((tag, i) => (
                   <span key={i} className="px-4 py-2 bg-gray-50 text-slate-700 rounded-lg border border-gray-200 font-medium">
                      {tag}
                   </span>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
           {/* Contact Card */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-slate-900">Contact Info</h3>
                 <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                       <Heart size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition">
                       <Share2 size={20} />
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-start">
                    <Phone size={20} className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                       <p className="text-xs text-gray-500">Phone Number</p>
                       <p className="font-bold text-slate-900">{vendor.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <Clock size={20} className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                       <p className="text-xs text-gray-500">Business Hours</p>
                       <p className="font-bold text-slate-900">{vendor.hours}</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <Map size={20} className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                       <p className="text-xs text-gray-500">Address</p>
                       <p className="font-bold text-slate-900">{vendor.location}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button 
                   onClick={() => window.location.href = `tel:${vendor.phone}`}
                   className="flex items-center justify-center py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                 >
                    Call Now
                 </button>
                 <button className="flex items-center justify-center py-2.5 border border-gray-300 text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition">
                    Get Directions
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;