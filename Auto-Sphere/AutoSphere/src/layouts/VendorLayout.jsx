import { useEffect, useState } from 'react';
import { Outlet, Link , useLocation } from 'react-router-dom';
import {
  StoreIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingBagIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  PlusCircleIcon,
  BarChartIcon,
  SearchIcon,
  WrenchIcon,
  HelpCircleIcon,
  MailIcon,
  PhoneIcon,
} from 'lucide-react';

import logo from '../utils/images/logo.png'

const INITIAL_VENDOR_PRODUCTS = [
  {
    id: 1,
    name: 'Toyota Aqua Headlight (Left)',
    sku: 'LGT-001',
    category: 'Lighting',
    brand: 'Depo',
    description: 'Imported OEM-style replacement with clear lens.',
    compatibility: 'Toyota Aqua 2015-2020',
    price: 12000,
    stock: 9,
    variants: [
      { id: 101, label: 'Left Side', sku: 'LGT-001-L', price: 12000, stock: 4 },
      { id: 102, label: 'Right Side', sku: 'LGT-001-R', price: 12000, stock: 5 },
    ],
    imageUrl: '',
    status: 'Published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Honda Civic X RS Grill',
    sku: 'BDY-023',
    category: 'Body Kits',
    brand: 'Genuine',
    description: 'Front RS style grill with chrome accents.',
    compatibility: 'Honda Civic 2016-2021',
    price: 8500,
    stock: 15,
    variants: [],
    imageUrl: '',
    status: 'Published',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_VENDOR_SERVICES = [
  {
    id: 1,
    title: 'Full Ceramic Coating Package',
    category: 'Detailing & Paint Protection',
    serviceType: 'In-Shop Only',
    description: 'Exterior paint correction and 3-year ceramic coating.',
    price: 35000,
    durationValue: 2,
    durationUnit: 'Days',
    requiresAppointment: true,
    imageUrl: '',
    status: 'Published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Engine Oil and Filter Service',
    category: 'Oil & Lube Service',
    serviceType: 'Both Available',
    description: 'Synthetic oil replacement with OEM filter and fluid check.',
    price: 6000,
    durationValue: 1,
    durationUnit: 'Hours',
    requiresAppointment: true,
    imageUrl: '',
    status: 'Published',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_VENDOR_ORDERS = [
  {
    id: '#ORD-9921',
    customer: 'Ali Khan',
    email: 'ali.khan@example.com',
    phone: '+92 300 4455667',
    items: 'Civic X RS Turbo Headlights',
    total: 45000,
    date: '2026-03-28',
    status: 'New',
    paymentStatus: 'Paid',
    delivery: {
      courier: '',
      trackingNumber: '',
      eta: '',
      lastUpdate: 'Order received',
    },
    statusHistory: [{ status: 'New', time: new Date().toISOString(), note: 'Order placed by buyer' }],
  },
  {
    id: '#ORD-9920',
    customer: 'Omer Riaz',
    email: 'omer.r@example.com',
    phone: '+92 321 4455667',
    items: 'Toyota Grande Body Kit, 3M Tint',
    total: 85000,
    date: '2026-03-28',
    status: 'Processing',
    paymentStatus: 'Paid',
    delivery: {
      courier: '',
      trackingNumber: '',
      eta: '',
      lastUpdate: 'Picked for processing',
    },
    statusHistory: [{ status: 'Processing', time: new Date().toISOString(), note: 'Vendor accepted order' }],
  },
  {
    id: '#ORD-9919',
    customer: 'Bilal Ahmed',
    email: 'bilal.ahmed@example.com',
    phone: '+92 333 5566778',
    items: 'Havoline 5W-30 Oil (x4)',
    total: 12500,
    date: '2026-03-27',
    status: 'Shipped',
    paymentStatus: 'Paid',
    delivery: {
      courier: 'TCS',
      trackingNumber: 'TCS998877',
      eta: '2026-03-30',
      lastUpdate: 'Package dispatched to courier hub',
    },
    statusHistory: [{ status: 'Shipped', time: new Date().toISOString(), note: 'Dispatched via TCS' }],
  },
  {
    id: '#ORD-9918',
    customer: 'Saad Malik',
    email: 'saad.m@example.com',
    phone: '+92 333 1112244',
    items: 'Universal Carbon Spoiler',
    total: 18000,
    date: '2026-03-27',
    status: 'Delivered',
    paymentStatus: 'Paid',
    delivery: {
      courier: 'Leopards',
      trackingNumber: 'LEP554211',
      eta: '2026-03-28',
      lastUpdate: 'Successfully delivered',
    },
    statusHistory: [{ status: 'Delivered', time: new Date().toISOString(), note: 'Order delivered successfully' }],
  },
  {
    id: '#ORD-9917',
    customer: 'Usman Qureshi',
    email: 'usman.q@example.com',
    phone: '+92 301 8899776',
    items: 'Suzuki Alto Door Visors',
    total: 2500,
    date: '2026-03-26',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    delivery: {
      courier: '',
      trackingNumber: '',
      eta: '',
      lastUpdate: 'Order cancelled on customer request',
    },
    statusHistory: [{ status: 'Cancelled', time: new Date().toISOString(), note: 'Order cancelled and refunded' }],
  },
  {
    id: '#ORD-9916',
    customer: 'Fahad Mustafa',
    email: 'fahad.m@example.com',
    phone: '+92 334 7788991',
    items: 'Android Panel 10\"',
    total: 15000,
    date: '2026-03-26',
    status: 'Packed',
    paymentStatus: 'Paid',
    delivery: {
      courier: '',
      trackingNumber: '',
      eta: '2026-03-31',
      lastUpdate: 'Order packed and ready for pickup',
    },
    statusHistory: [{ status: 'Packed', time: new Date().toISOString(), note: 'Packed by warehouse team' }],
  },
  {
    id: '#ORD-9915',
    customer: 'Hassan Tariq',
    email: 'hassan.t@example.com',
    phone: '+92 312 4455123',
    items: 'Toyota Aqua Headlight (Left), Engine Oil and Filter Service',
    total: 18000,
    date: '2026-03-25',
    status: 'Out for Delivery',
    paymentStatus: 'Paid',
    delivery: {
      courier: 'TCS',
      trackingNumber: 'TCS778899',
      eta: '2026-03-29',
      lastUpdate: 'Rider is on the way',
    },
    statusHistory: [{ status: 'Out for Delivery', time: new Date().toISOString(), note: 'Out for final delivery' }],
  },
  {
    id: '#ORD-9914',
    customer: 'Areeba Noor',
    email: 'areeba.n@example.com',
    phone: '+92 300 1122334',
    items: 'Honda Civic X RS Grill',
    total: 8500,
    date: '2026-03-29',
    status: 'New',
    paymentStatus: 'Pending',
    delivery: {
      courier: '',
      trackingNumber: '',
      eta: '',
      lastUpdate: 'Awaiting vendor confirmation',
    },
    statusHistory: [{ status: 'New', time: new Date().toISOString(), note: 'Order received from buyer' }],
  },
];

const VENDOR_ORDERS_STORAGE_KEY = 'autosphere_vendor_orders';
const VENDOR_PROFILE_STORAGE_KEY = 'autosphere_vendor_profile';
const VENDOR_PASSWORD_STORAGE_KEY = 'autosphere_vendor_password';

const DEFAULT_VENDOR_PROFILE = {
  storeName: 'Sehgal Motorsports',
  ownerName: 'Bilal Sehgal',
  email: 'contact@sehgalmotors.pk',
  phone: '+92 300 1234567',
  address: '14-A, Montgomery Road, Lahore',
  logoUrl: '',
};

const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [vendorProducts, setVendorProducts] = useState(INITIAL_VENDOR_PRODUCTS);
  const [vendorServices, setVendorServices] = useState(INITIAL_VENDOR_SERVICES);
  const [vendorProfile, setVendorProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem(VENDOR_PROFILE_STORAGE_KEY);
      if (!savedProfile) {
        return DEFAULT_VENDOR_PROFILE;
      }

      const parsed = JSON.parse(savedProfile);
      if (!parsed || typeof parsed !== 'object') {
        return DEFAULT_VENDOR_PROFILE;
      }

      return {
        ...DEFAULT_VENDOR_PROFILE,
        ...parsed,
      };
    } catch (error) {
      return DEFAULT_VENDOR_PROFILE;
    }
  });
  const [vendorPassword, setVendorPassword] = useState(() => {
    try {
      return localStorage.getItem(VENDOR_PASSWORD_STORAGE_KEY) || 'vendor123';
    } catch (error) {
      return 'vendor123';
    }
  });
  const [vendorOrders, setVendorOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem(VENDOR_ORDERS_STORAGE_KEY);
      if (!savedOrders) {
        return INITIAL_VENDOR_ORDERS;
      }

      const parsed = JSON.parse(savedOrders);
      if (!Array.isArray(parsed)) {
        return INITIAL_VENDOR_ORDERS;
      }

      // Keep user-updated orders and add any missing seeded orders for testing.
      const mergedById = new Map(parsed.map((order) => [order.id, order]));
      INITIAL_VENDOR_ORDERS.forEach((seededOrder) => {
        if (!mergedById.has(seededOrder.id)) {
          mergedById.set(seededOrder.id, seededOrder);
        }
      });

      return [...mergedById.values()];
    } catch (error) {
      return INITIAL_VENDOR_ORDERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(VENDOR_ORDERS_STORAGE_KEY, JSON.stringify(vendorOrders));
  }, [vendorOrders]);

  useEffect(() => {
    localStorage.setItem(VENDOR_PROFILE_STORAGE_KEY, JSON.stringify(vendorProfile));
  }, [vendorProfile]);

  useEffect(() => {
    localStorage.setItem(VENDOR_PASSWORD_STORAGE_KEY, vendorPassword);
  }, [vendorPassword]);

  const getStoreInitials = (name) => {
    const safeName = String(name || '').trim();
    if (!safeName) {
      return 'VS';
    }

    const words = safeName.split(/\s+/).filter(Boolean);
    return words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('');
  };

  const updateVendorProfile = (updates) => {
    setVendorProfile((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const changeVendorPassword = (currentPassword, newPassword) => {
    if (currentPassword !== vendorPassword) {
      return { ok: false, message: 'Current password is incorrect.' };
    }

    setVendorPassword(newPassword);
    return { ok: true, message: 'Password updated successfully.' };
  };

  const normalizeVariants = (variants = []) => {
    return variants.map((variant) => ({
      ...variant,
      id: variant.id || Date.now() + Math.floor(Math.random() * 10000),
      price: Number(variant.price) || 0,
      stock: Number(variant.stock) || 0,
    }));
  };

  const calculateProductStock = (productData) => {
    if (Array.isArray(productData.variants) && productData.variants.length > 0) {
      return productData.variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
    }

    return Number(productData.stock) || 0;
  };

  const addProduct = (productData) => {
    const variants = normalizeVariants(productData.variants || []);

    setVendorProducts((prev) => [
      {
        id: Date.now(),
        ...productData,
        variants,
        stock: calculateProductStock({ ...productData, variants }),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateProduct = (productId, updates) => {
    setVendorProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? (() => {
              const variants = normalizeVariants(updates.variants ?? product.variants ?? []);
              const mergedProduct = {
                ...product,
                ...updates,
                variants,
              };

              return {
                ...mergedProduct,
                stock: calculateProductStock(mergedProduct),
                updatedAt: new Date().toISOString(),
              };
            })()
          : product
      )
    );
  };

  const updateProductStock = (productId, delta) => {
    setVendorProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        // For products with variants, stock should be controlled through variant-level updates.
        if (Array.isArray(product.variants) && product.variants.length > 0) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(0, (Number(product.stock) || 0) + delta),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateProductVariantStock = (productId, variantId, delta) => {
    setVendorProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId || !Array.isArray(product.variants)) {
          return product;
        }

        const variants = product.variants.map((variant) => {
          if (variant.id !== variantId) {
            return variant;
          }

          return {
            ...variant,
            stock: Math.max(0, (Number(variant.stock) || 0) + delta),
          };
        });

        return {
          ...product,
          variants,
          stock: calculateProductStock({ ...product, variants }),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteProduct = (productId) => {
    setVendorProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const addService = (serviceData) => {
    setVendorServices((prev) => [
      {
        id: Date.now(),
        ...serviceData,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateService = (serviceId, updates) => {
    setVendorServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : service
      )
    );
  };

  const deleteService = (serviceId) => {
    setVendorServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  const updateOrderStatus = (orderId, nextStatus, note = '') => {
    setVendorOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        return {
          ...order,
          status: nextStatus,
          delivery: {
            ...order.delivery,
            lastUpdate: note || `Status updated to ${nextStatus}`,
          },
          statusHistory: [
            {
              status: nextStatus,
              time: new Date().toISOString(),
              note: note || `Vendor updated order to ${nextStatus}`,
            },
            ...(order.statusHistory || []),
          ],
        };
      })
    );
  };

  const updateOrderDelivery = (orderId, deliveryUpdates) => {
    setVendorOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        return {
          ...order,
          delivery: {
            ...order.delivery,
            ...deliveryUpdates,
            lastUpdate: deliveryUpdates.lastUpdate || order.delivery?.lastUpdate || 'Delivery details updated',
          },
          statusHistory: [
            {
              status: order.status,
              time: new Date().toISOString(),
              note: deliveryUpdates.lastUpdate || 'Delivery details updated',
            },
            ...(order.statusHistory || []),
          ],
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-slate-900 overflow-x-hidden relative">
      {showSupportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <HelpCircleIcon size={20} /> Vendor Support
              </h3>

              <button
                onClick={() => setShowSupportModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-slate-600 text-center">
                Need help with your store? Our support team is available 24/7.
              </p>

              <div className="space-y-4">

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <PhoneIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Call Us</h4>
                    <p className="text-sm text-slate-600">Immediate assistance for urgent issues.</p>
                    <a className="text-blue-700 font-bold hover:underline" href="tel:+923001234567">
                      +92 300 1234567
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <MailIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Support</h4>
                    <p className="text-sm text-slate-600">Response within 2–4 hours.</p>
                    <a className="text-green-700 font-bold hover:underline" href="mailto:vendor.support@autosphere.pk">
                      vendor.support@autosphere.pk
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-500 text-center">
                Ticket ID: <span className="font-mono font-bold text-slate-700">#VS-{Math.floor(Math.random() * 10000)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <img src={logo} alt="autospherelogo" className="w-10 h-10 object-contain" />
          <Link to="/">
            <h1 className="text-2xl font-thin text-white ml-3">Auto <span className='text-green-500'>Sphere</span></h1>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto">
            <XIcon size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">

          {/* Store Management */}
          <div>
            <p className="px-3 text-xs text-slate-500 font-bold uppercase mb-3">Store Management</p>

            <div className="space-y-1">
              <SidebarLink to="/vendor" icon={LayoutDashboardIcon} label="Dashboard" />
              <SidebarLink to="/vendor/inventory" icon={PackageIcon} label="Inventory" />
              <SidebarLink to="/vendor/add-product" icon={PlusCircleIcon} label="Add Product" />
              <SidebarLink to="/vendor/add-service" icon={WrenchIcon} label="Add Service" />
              <SidebarLink to="/vendor/orders" icon={ShoppingBagIcon} label="Orders" />
            </div>
          </div>

          {/* Insights */}
          <div>
            <p className="px-3 text-xs text-slate-500 font-bold uppercase mb-3">Insights</p>

            <div className="space-y-1">
              <SidebarLink to="/vendor/analytics" icon={BarChartIcon} label="Analytics" />
              <SidebarLink to="/vendor/settings" icon={SettingsIcon} label="Store Settings" />
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800">
            <LogOutIcon size={18} className="mr-3" />
            Log Out
          </Link>

          <button
            onClick={() => setShowSupportModal(true)}
            className="mt-2 w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-blue-300 hover:bg-slate-800"
          >
            <HelpCircleIcon size={18} className="mr-3" />
            Contact Support
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6">
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>

          {/* Search */}
          <div className="hidden md:flex relative w-full max-w-md">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Right Section */}
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{vendorProfile.storeName}</p>
                <p className="text-xs text-green-600">Verified Seller</p>
              </div>
              <Link
                to="/vendor/settings"
                aria-label="Open store settings"
                title="Store Settings"
                className="h-9 w-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold hover:bg-slate-800 transition"
              >
                {getStoreInitials(vendorProfile.storeName)}
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet
            context={{
              vendorProducts,
              vendorServices,
              addProduct,
              updateProduct,
              updateProductStock,
              updateProductVariantStock,
              deleteProduct,
              addService,
              updateService,
              deleteService,
              vendorOrders,
              updateOrderStatus,
              updateOrderDelivery,
              vendorProfile,
              updateVendorProfile,
              changeVendorPassword,
            }}
          />
        </main>
      </div>
    </div>
  );
};


const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();

  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        location.pathname === to ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      <Icon size={18} className="mr-3" />
      {label}
    </Link>
  );
};

export default VendorLayout;
