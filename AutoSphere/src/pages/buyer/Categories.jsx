import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ArrowRight, Package, ShoppingBag , ArrowLeft } from 'lucide-react';

import pic1 from '../../utils/images/download.jpeg';
import pic2 from '../../utils/images/download (1).jpeg'

// Mock Data for All Categories
const CATEGORIES = [
  {
    id: 1,
    name: 'Performance Parts',
    count: '1,200+ Items',
    image: pic1,
    description: 'Turbo kits, air intakes, exhausts, and ECU tuning parts.'
  },
  {
    id: 2,
    name: 'Rims & Tyres',
    count: '850+ Sets',
    image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=800&q=80',
    description: 'Alloy rims, tyres, and wheel accessories.'
  },
  {
    id: 3,
    name: 'Body Kits & Exterior',
    count: '430+ Kits',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    description: 'Bumpers, spoilers, side skirts, and facelifts.'
  },
  {
    id: 4,
    name: 'Car Care & Detailing',
    count: '560+ Products',
    image: pic2,
    description: 'Shampoos, waxes, polishes, and ceramic coatings.'
  },
  {
    id: 5,
    name: 'Lights & Optics',
    count: '320+ Items',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    description: 'LED headlights, projection lamps, and fog lights.'
  },
  {
    id: 6,
    name: 'Interior Accessories',
    count: '900+ Items',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    description: 'Seat covers, floor mats, and steering covers.'
  },
  {
    id: 7,
    name: 'Car Electronics',
    count: '150+ Gadgets',
    image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80',
    description: 'Android panels, speakers, dash cams, and sensors.'
  },
  {
    id: 8,
    name: 'Oils & Lubricants',
    count: '210+ Products',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    description: 'Engine oil, brake fluid, transmission fluid, and coolants.'
  }
];

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <Link to="/buyer" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </Link>
          <h1 className="text-3xl font-bold text-slate-900">Browse Categories</h1>
          <p className="text-gray-600 mt-2">Explore our extensive range of auto parts and accessories.</p>
        </div>
        
        <div className="w-full relative md:w-80">
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map(category => (
          <Link 
            to="/buyer/parts" 
            key={category.id} 
            className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                 <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                 <div className="flex items-center text-xs text-gray-300">
                    <Package size={14} className="mr-1.5" />
                    {category.count}
                 </div>
              </div>
            </div>

            {/* Description Area */}
            <div className="p-5 flex flex-col h-32 justify-between">
              <p className="text-sm text-gray-600 line-clamp-2 ">
                {category.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50 ">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">
                  Shop Now
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors text-gray-400">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
           <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-900">No categories found</h3>
           <p className="text-gray-500">Try searching for something else.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;