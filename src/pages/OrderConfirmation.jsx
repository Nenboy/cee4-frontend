import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import client from '../api/client';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const paid = searchParams.get('paid');

  useEffect(() => {
    client.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <div className="page">Loading...</div>;

  return (
    <div className="page order-confirmation">
      <div className="confirmation-box">
        <div className="success-icon">✓</div>
        <h1>{paid ? 'Payment Successful!' : 'Order Placed!'}</h1>
        <p>Thank you for shopping with Cee4 Collections.</p>
        <p className="order-number">Order #{order.order_number}</p>

        <div className="confirmation-details">
          <p><strong>Delivery to:</strong> {order.delivery_address}, {order.delivery_area}</p>
          <p><strong>Payment:</strong> {order.payment_method === 'paystack' ? 'Paid Online (Paystack)' : 'Pay on Delivery'}</p>
          <p><strong>Total:</strong> ₦{Number(order.total).toLocaleString()}</p>
        </div>

        <Link to="/orders" className="btn-primary">View My Orders</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
