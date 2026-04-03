import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// our main page 
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// our error-handling page 
import NotFound from './pages/NotFound';

// all vendors-side pages 
import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorInventory from './pages/vendor/Inventory';
import AddProduct from './pages/vendor/AddProduct';
import AddService from './pages/vendor/AddService';
import VendorOrders from './pages/vendor/Orders';
import StoreSettings from './pages/vendor/StoreSettings';
import VendorAnalytics from './pages/vendor/VendorAnalytics';

// all buyers-side import
import CarDetails from './pages/buyer/CarDetails';
import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerLayout from './layouts/BuyerLayout';
import Stores from './pages/buyer/Stores';
import StoreDetails from './pages/buyer/StoreDetails'
import Parts from './pages/buyer/Parts';
import Services from './pages/buyer/Services';
import Categories from './pages/buyer/Categories';
import TrackOrder from './pages/buyer/TrackOrder';
import Appointment from './pages/buyer/Appointment';
import Profile from './pages/buyer/Profile';
import ProfileSettings from './pages/buyer/ProfileSettings';
import RefundPolicy from './pages/buyer/RefundPolicy';

export function App() {
  return <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Buyer Routes */}
        <Route path="/buyer" element={<BuyerLayout />}>
          <Route index element={<BuyerDashboard />} />
          <Route path="stores" element={<Stores />} />
          <Route path="stores/:id" element={<StoreDetails />} />
          <Route path="parts" element={<Parts />} />
          <Route path="services" element={<Services />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
          <Route path="cars/:id" element={<CarDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="track-order" element={<TrackOrder />} />      
          <Route path="refund-policy" element={<RefundPolicy />} />
        </Route>

       {/* Vendor Routes */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="inventory" element={<VendorInventory />} />
          <Route path="add-product" element={<AddProduct/>} />
          <Route path="add-product/:productId" element={<AddProduct/>} />
          <Route path="add-service" element={<AddService />} />
          <Route path="add-service/:serviceId" element={<AddService />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<StoreSettings />} />
        </Route>

        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>;
}