import { useEffect, useState } from 'react';
import client from '../../api/client';
import { products as allProducts } from '../../api/mockData';

const STATUS_OPTIONS = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    // Admin needs ALL orders, not just the logged-in user's — pull straight
    // from the mock store for now (the real API's /admin/orders will list all).
    const saved = localStorage.getItem('cee4_mock_orders');
    setOrders(saved ? JSON.parse(saved).reverse() : []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = (order, status) => {
    const all = JSON.parse(localStorage.getItem('cee4_mock_orders') || '[]');
    const target = all.find((o) => o.id === order.id);
    if (target) target.status = status;
    localStorage.setItem('cee4_mock_orders', JSON.stringify(all));
    loadOrders();
  };

  const totalRevenue = orders.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0);

  return (
    <div className="page admin-page">
      <h1>Admin Dashboard — Cee4 Collections</h1>
      <div className="admin-tabs">
        <button className={tab === 'overview' ? 'tab-active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'products' ? 'tab-active' : ''} onClick={() => setTab('products')}>Products</button>
        <button className={tab === 'orders' ? 'tab-active' : ''} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card"><h3>{orders.length}</h3><p>Total Orders</p></div>
          <div className="stat-card"><h3>{orders.filter((o) => o.status === 'pending').length}</h3><p>Pending Orders</p></div>
          <div className="stat-card"><h3>₦{totalRevenue.toLocaleString()}</h3><p>Revenue (Paid)</p></div>
          <div className="stat-card"><h3>{allProducts.length}</h3><p>Products Listed</p></div>
        </div>
      )}

      {tab === 'products' && (
        <div className="admin-table-wrap">
          <p className="muted">Products currently come from the shared catalog. Once the MongoDB/Express backend is connected, this tab will support full create/edit/delete.</p>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {allProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category.name}</td>
                  <td>₦{p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-table-wrap">
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Order #</th><th>Total</th><th>Payment</th><th>Area</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>₦{Number(order.total).toLocaleString()}</td>
                    <td>{order.payment_method === 'paystack' ? 'Paystack' : 'On Delivery'} ({order.payment_status})</td>
                    <td>{order.delivery_area}</td>
                    <td>
                      <select value={order.status} onChange={(e) => updateStatus(order, e.target.value)}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
