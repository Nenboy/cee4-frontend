import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../lib/orders';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { deliveryAreas, DELIVERY_FEE } from '../api/mockData';

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipient_name: user?.full_name || '',
    recipient_phone: user?.phone || '',
    delivery_address: user?.address || '',
    delivery_area: deliveryAreas[0],
    payment_method: 'pay_on_delivery',
    notes: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = subtotal + DELIVERY_FEE;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        product_id: i.product_id || i.id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity),
        image_url: i.image_url || null,
      }));

      const order = await createOrder({
        total,
        payment_method: form.payment_method,
        payment_status: 'unpaid',
        delivery_area: form.delivery_area,
        delivery_address: form.delivery_address,
        recipient_name: form.recipient_name,
        recipient_phone: form.recipient_phone,
        notes: form.notes,
        items: orderItems,
      });

      clearCart();

      if (form.payment_method === 'paystack') {
        navigate(`/payment/mock-checkout?order=${order.id}`);
      } else {
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        Your cart is empty. <a href="/shop">Go shopping</a>.
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Delivery Details</h3>
          <label>
            Recipient Name
            <input name="recipient_name" value={form.recipient_name} onChange={handleChange} required />
          </label>
          <label>
            Phone Number
            <input name="recipient_phone" value={form.recipient_phone} onChange={handleChange} required />
          </label>
          <label>
            Delivery Address
            <input
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              required
              placeholder="Street, house number, landmark"
            />
          </label>
          <label>
            Area within Jos
            <select name="delivery_area" value={form.delivery_area} onChange={handleChange}>
              {deliveryAreas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
          <label>
            Order Notes (optional)
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
          </label>

          <h3>Payment Method</h3>
          <div className="payment-options">
            <label className={`payment-option ${form.payment_method === 'pay_on_delivery' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment_method"
                value="pay_on_delivery"
                checked={form.payment_method === 'pay_on_delivery'}
                onChange={handleChange}
              />
              <div>
                <strong>Pay on Delivery</strong>
                <p>Pay in cash when your order arrives.</p>
              </div>
            </label>

            <label className={`payment-option ${form.payment_method === 'paystack' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment_method"
                value="paystack"
                checked={form.payment_method === 'paystack'}
                onChange={handleChange}
              />
              <div>
                <strong>Pay Online (Paystack)</strong>
                <p>Pay now with a test card in the sandbox environment.</p>
              </div>
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary full-width" disabled={submitting}>
            {submitting
              ? 'Placing Order...'
              : form.payment_method === 'paystack'
              ? 'Continue to Payment'
              : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {items.map((item, idx) => (
            <div key={idx} className="summary-line">
              <span>{item.name} × {item.quantity}</span>
              <span>₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₦{DELIVERY_FEE.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}