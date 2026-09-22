import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">Cee4 <span>Collections</span></Link>

        <nav className="nav-links">
          <Link to="/shop">Shop</Link>
          <Link to="/shop?category=men">Men</Link>
          <Link to="/shop?category=women">Women</Link>
          <Link to="/shop?category=kids">Kids</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Cart{itemCount > 0 && <span className="badge">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              {/* NEW VENDOR LINKS */}
              <Link to="/my-products">My Products</Link>
              <Link to="/upload">Upload Product</Link>
              
              <Link to="/orders">My Orders</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-outline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}