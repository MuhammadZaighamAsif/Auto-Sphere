import  { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartIcon, ShareIcon, MapPinIcon, PhoneIcon, MailIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cars, vendors } from '../../utils/dummyData';
const CarDetails = () => {
  const {
    id
  } = useParams();
  const car = cars.find(c => c.id === parseInt(id || '0'));
  const vendor = car ? vendors.find(v => v.id === car.vendorId) : null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  if (!car || !vendor) {
    return <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Link to="/buyer/cars" className="text-primary hover:underline">
            Back to listings
          </Link>
        </div>
      </div>;
  }
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % car.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + car.images.length) % car.images.length);
  };
  return <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container py-8">
        <Link to="/buyer/cars" className="flex items-center text-primary hover:underline mb-6">
          <ChevronLeftIcon size={20} className="mr-1" />
          Back to listings
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <img src={car.images[currentImageIndex]} alt={car.title} className="w-full h-64 sm:h-96 object-cover" />
                {car.images.length > 1 && <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white">
                      <ChevronLeftIcon size={24} />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white">
                      <ChevronRightIcon size={24} />
                    </button>
                  </>}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                    <HeartIcon size={20} className="text-gray-600" />
                  </button>
                  <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                    <ShareIcon size={20} className="text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {car.images.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />)}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4">
                {car.images.map((image, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-primary' : 'border-transparent'}`}>
                    <img src={image} alt={`${car.title} ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>)}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPinIcon size={18} className="mr-1" />
                <span>{car.location}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Year</p>
                  <p className="font-bold">{car.year}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Mileage</p>
                  <p className="font-bold">{car.mileage} mi</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Transmission</p>
                  <p className="font-bold">{car.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fuel Type</p>
                  <p className="font-bold">{car.fuelType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Body Type</p>
                  <p className="font-bold">{car.bodyType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Color</p>
                  <p className="font-bold">{car.color}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Engine</p>
                  <p className="font-bold">{car.engineSize}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Condition</p>
                  <p className="font-bold">{car.condition}</p>
                </div>
              </div>
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Features & Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.features.map((feature, index) => <div key={index} className="flex items-center">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 mb-6">
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary">
                  ${car.price.toLocaleString()}
                </p>
                {car.originalPrice && <p className="text-gray-500 line-through">
                    ${car.originalPrice.toLocaleString()}
                  </p>}
              </div>
              <button className="w-full btn-primary mb-3">
                Schedule Test Drive
              </button>
              <button onClick={() => setShowContactForm(!showContactForm)} className="w-full btn-outline">
                Contact Seller
              </button>
              {showContactForm && <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-3">Send a Message</h3>
                  <form className="space-y-3">
                    <input type="text" placeholder="Your Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="email" placeholder="Your Email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="tel" placeholder="Your Phone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <textarea placeholder="Message" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" defaultValue={`I am interested in the ${car.title}`} />
                    <button type="submit" className="w-full btn-primary">
                      Send Message
                    </button>
                  </form>
                </div>}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-3 mb-4">
                  <img src={vendor.logo} alt={vendor.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold">{vendor.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{vendor.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{vendor.totalSales} sales</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {vendor.description}
                </p>
                <div className="space-y-2">
                  <a href={`tel:+1234567890`} className="flex items-center text-primary hover:underline">
                    <PhoneIcon size={16} className="mr-2" />
                    <span className="text-sm">Call Dealer</span>
                  </a>
                  <a href={`mailto:${vendor.name.toLowerCase().replace(' ', '')}@automarket.com`} className="flex items-center text-primary hover:underline">
                    <MailIcon size={16} className="mr-2" />
                    <span className="text-sm">Email Dealer</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4">Vehicle Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">
                    {car.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saves</span>
                  <span className="font-medium">{car.saves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(car.dateAdded).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {car.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default CarDetails;