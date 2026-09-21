import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const STATUS_LABELS = {
  pending: 'Pending', processing: 'Processing', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/orders').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="page empty-state">
        <h2>No orders yet</h2>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <strong>#{order.order_number}</strong>
                <p className="muted">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`status-badge status-${order.status}`}>{STATUS_LABELS[order.status]}</span>
            </div>
            <p>{order.items.length} item(s) — ₦{Number(order.total).toLocaleString()}</p>
            <p className="muted">
              {order.payment_method === 'paystack' ? 'Paid Online' : 'Pay on Delivery'} · {order.payment_status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
