import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';

const TEST_CARD = '4084 0840 8408 4081';

export default function MockPaystackCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');
  const orderId = searchParams.get('order');

  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (card.replace(/\s/g, '') !== TEST_CARD.replace(/\s/g, '')) {
      setError('This sandbox only accepts the Paystack test card shown below.');
      return;
    }

    setProcessing(true);
    // Simulate gateway processing delay, then verify via our mock client
    setTimeout(async () => {
      await client.get(`/payments/verify/${reference}`);
      setProcessing(false);
      navigate(`/order-confirmation/${orderId}?paid=1`);
    }, 1200);
  };

  return (
    <div className="page mock-paystack">
      <div className="paystack-card">
        <p className="paystack-badge">🔒 Paystack Test Mode (Sandbox)</p>
        <h2>Pay with Card</h2>
        <p className="test-card-hint">
          Use the official Paystack test card — no real money is charged:
        </p>
        <div className="test-card-box">
          <p><strong>Card:</strong> {TEST_CARD}</p>
          <p><strong>Expiry:</strong> any future date &nbsp; <strong>CVV:</strong> 408</p>
          <p><strong>PIN:</strong> 0000 &nbsp; <strong>OTP:</strong> 123456</p>
        </div>

        <form onSubmit={handlePay}>
          <label>
            Card Number
            <input value={card} onChange={(e) => setCard(e.target.value)} placeholder="4084 0840 8408 4081" required />
          </label>
          <div className="form-row">
            <label>
              Expiry
              <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" required />
            </label>
            <label>
              CVV
              <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="408" required />
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary full-width" disabled={processing}>
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
