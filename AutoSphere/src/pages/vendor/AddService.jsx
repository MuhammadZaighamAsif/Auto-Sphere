import { useMemo, useState } from 'react';
import { UploadIcon, ChevronLeftIcon } from 'lucide-react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';

const SERVICE_CATEGORIES = [
  'Detailing & Paint Protection',
  'Mechanical Repair',
  'Tuning & Performance',
  'Wraps & Aesthetics',
  'Oil & Lube Service',
  'Inspection Service',
];

const emptyServiceForm = {
  title: '',
  category: '',
  serviceType: 'In-Shop Only',
  description: '',
  price: '',
  durationValue: '',
  durationUnit: 'Hours',
  requiresAppointment: false,
  imageUrl: '',
};

const AddService = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const isEditMode = Boolean(serviceId);
  const { vendorServices, addService, updateService } = useOutletContext();

  const existingService = useMemo(() => {
    if (!isEditMode) {
      return null;
    }

    return vendorServices.find((service) => service.id === Number(serviceId)) || null;
  }, [isEditMode, serviceId, vendorServices]);

  const [formData, setFormData] = useState(() =>
    existingService
      ? {
          title: existingService.title || '',
          category: existingService.category || '',
          serviceType: existingService.serviceType || 'In-Shop Only',
          description: existingService.description || '',
          price: existingService.price ?? '',
          durationValue: existingService.durationValue ?? '',
          durationUnit: existingService.durationUnit || 'Hours',
          requiresAppointment: Boolean(existingService.requiresAppointment),
          imageUrl: existingService.imageUrl || '',
        }
      : emptyServiceForm
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const inputClassName = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
      fieldErrors[field] ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
    }`;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
    setErrorMessage('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG or PNG).');
      event.target.value = '';
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setErrorMessage('Image size must be 5MB or less.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: String(reader.result || ''),
      }));
      setFieldErrors((prev) => {
        if (!prev.imageUrl) {
          return prev;
        }

        const nextErrors = { ...prev };
        delete nextErrors.imageUrl;
        return nextErrors;
      });
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const buildPayload = (status) => ({
    ...formData,
    price: Number(formData.price) || 0,
    durationValue: Number(formData.durationValue) || 0,
    status,
  });

  const saveService = (status) => {
    const validationErrors = {};
    const requiredFields = ['title', 'category', 'serviceType', 'description', 'price', 'durationValue', 'durationUnit', 'imageUrl'];

    requiredFields.forEach((field) => {
      if (!String(formData[field]).trim()) {
        validationErrors[field] = 'This field is required.';
      }
    });

    if (!String(formData.price).trim() || Number(formData.price) <= 0) {
      validationErrors.price = 'Enter a valid price greater than 0.';
    }

    if (!String(formData.durationValue).trim() || Number(formData.durationValue) <= 0) {
      validationErrors.durationValue = 'Enter a valid duration greater than 0.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage('Please complete all required fields before publishing.');
      return;
    }

    setFieldErrors({});
    setErrorMessage('');

    const payload = buildPayload(status);

    if (isEditMode && existingService) {
      updateService(existingService.id, payload);
    } else {
      addService(payload);
    }

    navigate('/vendor/inventory');
  };

  if (isEditMode && !existingService) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="text-xl font-bold">Service not found</h2>
        <p className="mt-2 text-sm">The service you are trying to edit does not exist anymore.</p>
        <Link to="/vendor/inventory" className="mt-4 inline-flex items-center text-sm font-semibold underline">
          <ChevronLeftIcon size={14} className="mr-1" /> Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans text-slate-900">
      <div className="mb-6">
        <Link to="/vendor" className="text-gray-500 hover:text-slate-900 text-sm flex items-center mb-2">
          <ChevronLeftIcon size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>
        <p className="text-gray-500">Create, edit, and categorize your professional service offerings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Service Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Full Ceramic Coating Package (3 Years)"
                  className={inputClassName('title')}
                />
                {fieldErrors.title && <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClassName('category')}
                  >
                    <option value="">Select Category</option>
                    {SERVICE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
                 </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Type *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={inputClassName('serviceType')}
                  >
                    <option>In-Shop Only</option>
                    <option>Mobile Service (Home Visit)</option>
                    <option>Both Available</option>
                  </select>
                  {fieldErrors.serviceType && <p className="mt-1 text-xs text-red-600">{fieldErrors.serviceType}</p>}
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what's included in this service package..."
                  className={`${inputClassName('description')} resize-none`}
                ></textarea>
                {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Pricing & Timing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (PKR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    placeholder="0"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                      fieldErrors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {fieldErrors.price && <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>}
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Duration *</label>
                <div className="flex gap-2">
                   <input
                     name="durationValue"
                     value={formData.durationValue}
                     onChange={handleChange}
                     type="number"
                     placeholder="2"
                     className={`w-20 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                       fieldErrors.durationValue ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                     }`}
                   />
                   <select
                     name="durationUnit"
                     value={formData.durationUnit}
                     onChange={handleChange}
                     className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white ${
                       fieldErrors.durationUnit ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                     }`}
                   >
                      <option>Hours</option>
                      <option>Days</option>
                   </select>
                </div>
                {fieldErrors.durationValue && <p className="mt-1 text-xs text-red-600">{fieldErrors.durationValue}</p>}
                {fieldErrors.durationUnit && <p className="mt-1 text-xs text-red-600">{fieldErrors.durationUnit}</p>}
               </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <div className="flex items-center gap-2 mb-2">
                  <input
                    name="requiresAppointment"
                    checked={formData.requiresAppointment}
                    onChange={handleChange}
                    type="checkbox"
                    id="appointment"
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="appointment" className="text-sm font-medium text-slate-700">Require Appointment Booking?</label>
               </div>
               <p className="text-xs text-gray-500 ml-6">If checked, customers will be asked to select a date and time slot.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-slate-900 mb-4">Service Gallery</h2>
            <input
              id="service-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageUpload}
              className="hidden"
            />

            <label
              htmlFor="service-image-upload"
              className={`block border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer ${
                fieldErrors.imageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <UploadIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900">Upload portfolio photos</p>
              <p className="text-xs text-gray-500">Show off your previous work (Max 5MB)</p>
            </label>
            {fieldErrors.imageUrl && <p className="mt-2 text-xs text-red-600">{fieldErrors.imageUrl}</p>}

            {formData.imageUrl && (
              <div className="mt-4 space-y-3">
                <img
                  src={formData.imageUrl}
                  alt="Service preview"
                  className="h-40 w-full rounded-lg border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            {errorMessage && <p className="text-xs font-medium text-red-600">{errorMessage}</p>}
            <button
              onClick={() => saveService('Published')}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
            >
              {isEditMode ? 'Update Service' : 'Publish Service'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddService;