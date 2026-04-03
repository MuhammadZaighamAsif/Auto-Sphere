import { useMemo, useState } from 'react';
import { UploadIcon, ChevronLeftIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';

const PRODUCT_CATEGORIES = [
  'Engine Parts',
  'Body Kits',
  'Lighting',
  'Interior Accessories',
  'Oils & Fluids',
  'Electronics',
  'Tyres',
];

const emptyProductForm = {
  name: '',
  category: '',
  brand: '',
  description: '',
  price: '',
  stock: '',
  sku: '',
  compatibility: '',
  imageUrl: '',
  variants: [],
};

const createEmptyVariant = () => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  label: '',
  sku: '',
  price: '',
  stock: '',
});

const AddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const { vendorProducts, addProduct, updateProduct } = useOutletContext();

  const existingProduct = useMemo(() => {
    if (!isEditMode) {
      return null;
    }

    return vendorProducts.find((product) => product.id === Number(productId)) || null;
  }, [isEditMode, productId, vendorProducts]);

  const [formData, setFormData] = useState(() =>
    existingProduct
      ? {
          name: existingProduct.name || '',
          category: existingProduct.category || '',
          brand: existingProduct.brand || '',
          description: existingProduct.description || '',
          price: existingProduct.price ?? '',
          stock: existingProduct.stock ?? '',
          sku: existingProduct.sku || '',
          compatibility: existingProduct.compatibility || '',
          imageUrl: existingProduct.imageUrl || '',
          variants: Array.isArray(existingProduct.variants)
            ? existingProduct.variants.map((variant) => ({
                id: variant.id || Date.now() + Math.floor(Math.random() * 10000),
                label: variant.label || '',
                sku: variant.sku || '',
                price: variant.price ?? '',
                stock: variant.stock ?? '',
              }))
            : [],
        }
      : emptyProductForm
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const inputClassName = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
      fieldErrors[field] ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
    }`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const updateVariantField = (variantId, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [fieldName]: value,
            }
          : variant
      ),
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariant = (variantId) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== variantId),
    }));
  };

  const buildPayload = () => ({
    ...formData,
    price: Number(formData.price) || 0,
    stock:
      formData.variants.length > 0
        ? formData.variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0)
        : Number(formData.stock) || 0,
    variants: formData.variants
      .filter((variant) => String(variant.label).trim() || String(variant.sku).trim())
      .map((variant) => ({
        ...variant,
        price: Number(variant.price) || 0,
        stock: Number(variant.stock) || 0,
      })),
    status: 'Published',
  });

  const saveProduct = () => {
    const validationErrors = {};
    const requiredFields = ['name', 'category', 'brand', 'description', 'price', 'sku', 'compatibility', 'imageUrl'];

    requiredFields.forEach((field) => {
      if (!String(formData[field]).trim()) {
        validationErrors[field] = 'This field is required.';
      }
    });

    if (!String(formData.price).trim() || Number(formData.price) <= 0) {
      validationErrors.price = 'Enter a valid price greater than 0.';
    }

    if (formData.variants.length === 0) {
      if (!String(formData.stock).trim()) {
        validationErrors.stock = 'Stock quantity is required.';
      } else if (Number(formData.stock) < 0) {
        validationErrors.stock = 'Stock cannot be negative.';
      }
    }

    if (formData.variants.length > 0) {
      const hasInvalidVariant = formData.variants.some(
        (variant) =>
          !String(variant.label).trim() ||
          !String(variant.sku).trim() ||
          !String(variant.price).trim() ||
          Number(variant.price) <= 0 ||
          !String(variant.stock).trim() ||
          Number(variant.stock) < 0
      );

      if (hasInvalidVariant) {
        validationErrors.variants = 'Complete all variant fields with valid values.';
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage('Please complete all required fields before publishing.');
      return;
    }

    setFieldErrors({});
    setErrorMessage('');

    const payload = buildPayload();

    if (isEditMode && existingProduct) {
      updateProduct(existingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/vendor/inventory');
  };

  if (isEditMode && !existingProduct) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="text-xl font-bold">Product not found</h2>
        <p className="mt-2 text-sm">The product you are trying to edit does not exist anymore.</p>
        <Link to="/vendor/inventory" className="mt-4 inline-flex items-center text-sm font-semibold underline">
          <ChevronLeftIcon size={14} className="mr-1" /> Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Link to="/vendor/inventory" className="text-gray-500 hover:text-slate-900 text-sm flex items-center mb-2">
          <ChevronLeftIcon size={16} className="mr-1" /> Back to Inventory
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-gray-500">Add, edit, and categorize parts in your store catalog.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Honda Civic X RS Turbo Headlights"
                  className={inputClassName('name')}
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
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
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
                 </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Genuine / Depo"
                    className={inputClassName('brand')}
                  />
                  {fieldErrors.brand && <p className="mt-1 text-xs text-red-600">{fieldErrors.brand}</p>}
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the product features, condition, and warranty..."
                  className={`${inputClassName('description')} resize-none`}
                ></textarea>
                {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Inventory & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (PKR) *</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="0"
                  className={inputClassName('price')}
                />
                {fieldErrors.price && <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>}
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity {formData.variants.length === 0 ? '*' : ''}</label>
                <input
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  type="number"
                  placeholder="0"
                  disabled={formData.variants.length > 0}
                  className={inputClassName('stock')}
                />
                {formData.variants.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">Stock is auto-calculated from variant stock levels.</p>
                )}
                {fieldErrors.stock && <p className="mt-1 text-xs text-red-600">{fieldErrors.stock}</p>}
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU *</label>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  type="text"
                  placeholder="Product Code"
                  className={inputClassName('sku')}
                />
                {fieldErrors.sku && <p className="mt-1 text-xs text-red-600">{fieldErrors.sku}</p>}
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Compatibility *</label>
                <input
                  name="compatibility"
                  value={formData.compatibility}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Civic 2016-2021"
                  className={inputClassName('compatibility')}
                />
                {fieldErrors.compatibility && <p className="mt-1 text-xs text-red-600">{fieldErrors.compatibility}</p>}
               </div>
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Product Variants</h3>
                  <p className="text-xs text-gray-500">Track stock per size/type/version for real-time inventory control.</p>
                </div>
                <button
                  onClick={addVariant}
                  type="button"
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"
                >
                  <PlusIcon size={14} className="mr-1" /> Add Variant
                </button>
              </div>

              {formData.variants.length === 0 ? (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">No variants added. Use base stock for this product.</p>
              ) : (
                <div className="space-y-3">
                  {formData.variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-1 gap-2 rounded-lg border border-gray-200 p-3 md:grid-cols-12">
                      <input
                        value={variant.label}
                        onChange={(event) => updateVariantField(variant.id, 'label', event.target.value)}
                        placeholder="Variant Label (e.g. Left Side)"
                        className="md:col-span-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <input
                        value={variant.sku}
                        onChange={(event) => updateVariantField(variant.id, 'sku', event.target.value)}
                        placeholder="Variant SKU"
                        className="md:col-span-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <input
                        value={variant.price}
                        onChange={(event) => updateVariantField(variant.id, 'price', event.target.value)}
                        type="number"
                        placeholder="Price"
                        className="md:col-span-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <input
                        value={variant.stock}
                        onChange={(event) => updateVariantField(variant.id, 'stock', event.target.value)}
                        type="number"
                        placeholder="Stock"
                        className="md:col-span-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <button
                        onClick={() => removeVariant(variant.id)}
                        type="button"
                        className="md:col-span-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 hover:text-red-600"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end text-xs font-semibold text-slate-700">
                    Total variant stock: {formData.variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0)}
                  </div>
                </div>
              )}
              {fieldErrors.variants && <p className="mt-3 text-xs font-medium text-red-600">{fieldErrors.variants}</p>}
            </div>
          </div>

        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-slate-900 mb-4">Product Images</h2>
            <input
              id="product-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageUpload}
              className="hidden"
            />

            <label
              htmlFor="product-image-upload"
              className={`block border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer ${
                fieldErrors.imageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <UploadIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900">Click to upload</p>
              <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
            </label>
            {fieldErrors.imageUrl && <p className="mt-2 text-xs text-red-600">{fieldErrors.imageUrl}</p>}

            {formData.imageUrl && (
              <div className="mt-4 space-y-3">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
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
              onClick={saveProduct}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
            >
              {isEditMode ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;