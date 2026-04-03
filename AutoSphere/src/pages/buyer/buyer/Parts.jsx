import { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, ShoppingCartIcon, StarIcon, CheckCircle2 , ArrowLeft} from 'lucide-react';
import {Link, useOutletContext, useSearchParams} from 'react-router-dom'


import pic3 from '../../utils/images/download (2).jpeg'


// Mock Data for Parts
const ALL_PARTS = [
  {
    id: 1,
    name: 'Honda Civic X RS Turbo Grill',
    make: 'Honda',
    model: 'Civic',
    price: 12500,
    category: 'Exterior',
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80',
    stock: true,
    vendor: 'Sehgal Motorsports'
  },
  {
    id: 2,
    name: 'Toyota Corolla Grande Paddle Shifters',
    make: 'Toyota',
    model: 'Corolla',
    price: 18000,
    category: 'Interior',
    rating: 4.9,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    stock: true,
    vendor: 'Toyota Cantt'
  },
  {
    id: 3,
    name: 'Suzuki Alto 660cc Android Panel (9")',
    make: 'Suzuki',
    model: 'Alto',
    price: 11500,
    category: 'Electronics',
    rating: 4.6,
    reviews: 310,
    image: pic3,
    stock: false,
    vendor: 'Multan Electronics'
  },
  {
    id: 4,
    name: 'Yokohama Advan dB V552 (195/65/R15)',
    make: 'Toyota',
    model: 'Aqua',
    price: 28000,
    category: 'Tyres',
    rating: 5.0,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=1000&q=80',
    stock: true,
    vendor: 'Shaheen Tyres'
  },
  {
    id: 5,
    name: 'Liqui Moly 5W-40 Synthetic Oil (4L)',
    make: 'Universal',
    model: 'All Models',
    price: 9500,
    category: 'Maintenance',
    rating: 4.9,
    reviews: 500,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    stock: true,
    vendor: 'AutoXperts'
  },
  {
    id: 6,
    name: 'Universal Carbon Fiber Spoiler',
    make: 'Universal',
    model: 'All Models',
    price: 8500,
    category: 'Exterior',
    rating: 4.2,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80',
    stock: true,
    vendor: 'Karachi Customs'
  }
];

const Parts = () => {
  const [searchParams] = useSearchParams();
  const { addToCart } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');

  const categories = ['All', 'Exterior', 'Interior', 'Electronics', 'Tyres', 'Maintenance'];
  const makes = ['All', ...new Set(ALL_PARTS.map(part => part.make))];
  const models = ['All', ...new Set(ALL_PARTS.filter(part => selectedMake === 'All' || part.make === selectedMake).map(part => part.model))];

  useEffect(() => {
    const requestedCategory = searchParams.get('category');
    if (!requestedCategory) {
      return;
    }

    if (categories.includes(requestedCategory)) {
      setSelectedCategory(requestedCategory);
      return;
    }

    setSelectedCategory('All');
  }, [searchParams]);

  const filteredParts = ALL_PARTS.filter(part => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      part.name.toLowerCase().includes(searchValue) ||
      part.vendor.toLowerCase().includes(searchValue) ||
      part.make.toLowerCase().includes(searchValue) ||
      part.model.toLowerCase().includes(searchValue);
    const matchesMake = selectedMake === 'All' || part.make === selectedMake;
    const matchesModel = selectedModel === 'All' || part.model === selectedModel;
    const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
    return matchesSearch && matchesCategory && matchesMake && matchesModel;
  });

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel('All');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMake('All');
    setSelectedModel('All');
    setSelectedCategory('All');
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <Link to="/buyer" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </Link>
          <h1 className="text-3xl font-bold text-slate-900">Auto Parts & Accessories</h1>
          <p className="text-gray-600 mt-2">Genuine parts and premium upgrades for your vehicle.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
           <div className="relative md:w-80 lg:w-96">
              <input 
                type="text" 
                placeholder="Search parts, make, model, or seller" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <FilterIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedMake}
            onChange={handleMakeChange}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {makes.map(make => (
              <option key={make} value={make}>{make === 'All' ? 'All Makes' : make}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {models.map(model => (
              <option key={model} value={model}>{model === 'All' ? 'All Models' : model}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-slate-900">{filteredParts.length}</span> part{filteredParts.length === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredParts.map(part => (
          <div key={part.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img 
                src={part.image} 
                alt={part.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              {part.stock ? (
                <span className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                  IN STOCK
                </span>
              ) : (
                 <span className="absolute top-2 left-2 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{part.category}</span>
                 <div className="flex items-center text-xs font-bold text-slate-700">
                    <StarIcon size={12} className="text-yellow-400 fill-current mr-1" />
                    {part.rating}
                 </div>
              </div>

                <p className="mb-1 text-xs font-medium text-green-700">{part.make} • {part.model}</p>

              <h3 className="font-bold text-slate-900 mb-1 leading-tight line-clamp-2 hover:text-green-600 transition cursor-pointer">
                {part.name}
              </h3>
              
              <div className="flex items-center text-xs text-gray-500 mb-4">
                 <CheckCircle2 size={12} className="mr-1 text-green-600" />
                 Sold by {part.vendor}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                 <div>
                    <span className="block text-lg font-bold text-slate-900">Rs. {part.price.toLocaleString()}</span>
                 </div>
                 <button 
                   onClick={() => addToCart(part)}
                   disabled={!part.stock}
                   className={`p-2.5 rounded-lg transition-colors ${
                     part.stock 
                     ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   }`}
                   title={part.stock ? 'Add to cart' : 'Out of stock'}
                 >
                    <ShoppingCartIcon size={20} />
                 </button>
              </div>

              <button
                onClick={() => addToCart(part)}
                disabled={!part.stock}
                className={`mt-3 w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
                  part.stock
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {part.stock ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Parts;