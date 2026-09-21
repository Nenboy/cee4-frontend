import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {items.map((item) => (
          <div key={`${item.product_id}-${item.size}-${item.color}`} className="cart-item">
            <div className="cart-item-image">
              {item.image ? <img src={item.image} alt={item.name} /> : <div className="image-placeholder small">No image</div>}
            </div>
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p className="variant-note">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
              <p className="price-now">₦{item.price.toLocaleString()}</p>
            </div>
            <div className="qty-stepper">
              <button onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
            </div>
            <p className="line-total">₦{(item.price * item.quantity).toLocaleString()}</p>
            <button className="remove-btn" onClick={() => removeItem(item)}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <p className="summary-note">Delivery fee calculated at checkout (Jos deliveries only).</p>
        <button className="btn-primary full-width" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
