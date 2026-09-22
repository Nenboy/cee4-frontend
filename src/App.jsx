import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { RequireAuth, RequireAdmin } from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MockPaystackCheckout from './pages/MockPaystackCheckout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import UploadProduct from './pages/UploadProduct';
import EditProduct from './pages/EditProduct';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/payment/mock-checkout" element={<RequireAuth><MockPaystackCheckout /></RequireAuth>} />
          <Route path="/order-confirmation/:id" element={<RequireAuth><OrderConfirmation /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />

          <Route path="/my-products" element={<RequireAuth><VendorDashboard /></RequireAuth>} />
          <Route path="/upload" element={<RequireAuth><UploadProduct /></RequireAuth>} />
          <Route path="/edit-product/:id" element={<RequireAuth><EditProduct /></RequireAuth>} />

          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

          <Route path="*" element={<div className="page">Page not found.</div>} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Cee4 Collections — Clothing delivered within Jos.</p>
      </footer>
    </>
  );
}