import { useState } from 'react';
import { 
  SearchIcon, MapPinIcon, CalendarIcon, StarIcon, 
  WrenchIcon, X, Clock, CheckCircle, ChevronRight , ArrowLeft
} from 'lucide-react';
import {Link, useNavigate, useOutletContext} from 'react-router-dom'



import pic1 from '../../utils/images/download.jpeg';
import pic2 from '../../utils/images/download (1).jpeg'

// Mock Data for Services
const SERVICES = [
  {
    id: 1,
    title: 'Complete Periodic Maintenance',
    provider: 'Honda Pit Stop',
    location: 'Model Town, Lahore',
    priceStart: 5000,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=80',
    tags: ['Oil Change', 'Tuning', 'Inspection']
  },
  {
    id: 2,
    title: 'Ceramic Coating Package (3 Years)',
    provider: 'Islamabad Detailing Hub',
    location: 'G-10 Markaz, Islamabad',
    priceStart: 45000,
    rating: 5.0,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80',
    tags: ['Detailing', 'Paint Correction', 'Protection']
  },
  {
    id: 3,
    title: 'Car AC Gas Refill & Service',
    provider: 'CoolCar Services',
    location: 'DHA Phase 6, Karachi',
    priceStart: 3500,
    rating: 4.5,
    reviews: 156,
    image: pic1,
    tags: ['AC Repair', 'Gas Refill']
  },
  {
    id: 4,
    title: 'ECU Remapping & Tuning',
    provider: 'MaxPower Motorsports',
    location: 'Johar Town, Lahore',
    priceStart: 25000,
    rating: 4.8,
    reviews: 320,
    image: pic2,
    tags: ['Performance', 'Dyno', 'Chip Tuning']
  },
  {
    id: 5,
    title: 'Suspension & Alignment Service',
    provider: 'Wheel Masters',
    location: 'Saddar, Rawalpindi',
    priceStart: 2000,
    rating: 4.6,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=1000&q=80',
    tags: ['Alignment', 'Shocks', 'Balancing']
  }
];

// Mock Scheduler Data
const DATES = [
  { day: 'Mon', date: '25 Nov' },
  { day: 'Tue', date: '26 Nov' },
  { day: 'Wed', date: '27 Nov' },
  { day: 'Thu', date: '28 Nov' },
  { day: 'Fri', date: '29 Nov' },
];

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', 
  '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM'
];

const Services = () => {
  const navigate = useNavigate();
  const { addAppointment } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  
  // State for Booking Modal
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [bookingStep, setBookingStep] = useState('select');

  const cities = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];

  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || service.location.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  const handleBookClick = (service) => {
    setSelectedService(service);
    setBookingStep('select');
    setBookingDate(null);
    setBookingTime(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !bookingDate || !bookingTime) return;

    addAppointment({
      serviceId: selectedService.id,
      title: selectedService.title,
      provider: selectedService.provider,
      location: selectedService.location,
      image: selectedService.image,
      date: bookingDate,
      time: bookingTime,
      priceStart: selectedService.priceStart
    });

    setBookingStep('success');
  };

  const closeBookingModal = () => {
    setSelectedService(null);
    setBookingStep('select');
    setBookingDate(null);
    setBookingTime(null);
  };

  const handleViewAppointments = () => {
    closeBookingModal();
    navigate('/buyer/appointment');
  };

  return (
    <div className="container py-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <Link to="/buyer" className="inline-flex items-center text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </Link>
          <h1 className="text-3xl font-bold text-slate-900">Expert Auto Services</h1>
          <p className="text-gray-600 mt-2">Book top-rated mechanics, detailers, and electricians near you.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
           <select 
             value={selectedCity}
             onChange={(e) => setSelectedCity(e.target.value)}
             className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-600"
           >
             {cities.map(city => <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>)}
           </select>

           <div className="relative md:w-80">
              <input 
                type="text" 
                placeholder="Search services (e.g. 'Tuning', 'AC')..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           </div>
        </div>
      </div>

      {/* List Layout */}
      <div className="space-y-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-64 h-48 md:h-auto relative">
               <img 
                 src={service.image} 
                 alt={service.title} 
                 className="w-full h-full object-cover" 
               />
               <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center shadow-sm">
                  <StarIcon size={14} className="text-yellow-500 fill-current mr-1" />
                  <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                  <span className="text-[10px] text-gray-500 ml-1">({service.reviews})</span>
               </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center">
                        <WrenchIcon size={14} className="mr-1" /> {service.provider}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                     <MapPinIcon size={16} className="mr-1" />
                     {service.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                     {service.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>

               <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                     <span className="text-xs text-gray-500">Starting from</span>
                     <p className="text-xl font-bold text-slate-900">Rs. {service.priceStart.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handleBookClick(service)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                  >
                     <CalendarIcon size={18} className="mr-2" /> Book Appointment
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- BOOKING MODAL --- */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                 <div>
                    <h3 className="font-bold text-lg">Schedule Service</h3>
                    <p className="text-xs text-gray-300">{selectedService.provider}</p>
                 </div>
                 <button onClick={closeBookingModal} className="hover:bg-slate-700 p-1 rounded-full transition">
                    <X size={20} />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {bookingStep === 'select' ? (
                  <>
                    {/* Date Selection */}
                    <div className="mb-6">
                       <label className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                          <CalendarIcon size={16} className="mr-2 text-green-600" /> Select Date
                       </label>
                       <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                          {DATES.map((item, idx) => (
                             <button 
                               key={idx}
                               onClick={() => setBookingDate(item.date)}
                               className={`min-w-[64px] sm:min-w-[70px] flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                 bookingDate === item.date 
                                 ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' 
                                 : 'border-gray-200 text-gray-600 hover:border-green-300'
                               }`}
                             >
                                <span className="text-xs font-medium uppercase">{item.day}</span>
                                <span className="text-lg font-bold">{item.date.split(' ')[0]}</span>
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                       <label className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                          <Clock size={16} className="mr-2 text-green-600" /> Select Time Slot
                       </label>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TIME_SLOTS.map((time, idx) => (
                             <button 
                               key={idx}
                               onClick={() => setBookingTime(time)}
                               className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                                 bookingTime === time 
                                 ? 'bg-green-600 text-white border-green-600' 
                                 : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                               }`}
                             >
                                {time}
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* Confirm Button */}
                    <button 
                      onClick={handleConfirmBooking}
                      disabled={!bookingDate || !bookingTime}
                      className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition ${
                        bookingDate && bookingTime 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                       Confirm Appointment <ChevronRight size={18} className="ml-1" />
                    </button>
                  </>
                ) : (
                  // Success State
                  <div className="text-center py-8">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600 animate-in zoom-in duration-300" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                     <p className="text-gray-500 mb-6">
                        Your appointment with <span className="font-bold text-slate-800">{selectedService.provider}</span> is set for <br/>
                        <span className="text-green-600 font-bold">{bookingDate}</span> at <span className="text-green-600 font-bold">{bookingTime}</span>.
                     </p>
                     <button 
                      onClick={handleViewAppointments}
                       className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                     >
                      View My Appointments
                     </button>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Services;