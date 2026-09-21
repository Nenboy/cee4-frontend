import { useEffect, useState } from 'react';
import {
  getAllProducts,
  approveProduct,
  deleteProduct,
  getAllUsers,
  updateUserRole,
  toggleBanUser,
} from '../../lib/products';
import { getAllOrders, updateOrderStatus } from '../../lib/orders';

const STATUS_OPTIONS = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, profs, ords] = await Promise.all([
        getAllProducts(),
        getAllUsers(),
        getAllOrders(),
      ]);
      setProducts(prods);
      setUsers(profs);
      setOrders(ords);

      const { supabase } = await import('../../lib/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveProduct(id);
      setProducts(products.map((p) => (p.id === id ? { ...p, status: 'approved' } : p)));
    } catch (err) {
      alert('Error approving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (user.id === currentUserId && newRole !== 'admin') {
      alert('You cannot demote yourself. Ask another admin to do it.');
      return;
    }
    try {
      const updated = await updateUserRole(user.id, newRole);
      setUsers(users.map((u) => (u.id === user.id ? updated : u)));
    } catch (err) {
      alert('Error changing role: ' + err.message);
    }
  };

  const handleToggleBan = async (user) => {
    if (user.id === currentUserId) {
      alert('You cannot ban yourself.');
      return;
    }
    const nextBanned = !user.banned;
    if (!window.confirm(nextBanned ? 'Ban this user?' : 'Unban this user?')) return;
    try {
      const updated = await toggleBanUser(user.id, nextBanned);
      setUsers(users.map((u) => (u.id === user.id ? updated : u)));
    } catch (err) {
      alert('Error updating ban status: ' + err.message);
    }
  };

  const handleOrderStatusChange = async (order, status) => {
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders(orders.map((o) => (o.id === order.id ? updated : o)));
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((s, o) => s + Number(o.total), 0);

  if (loading) return <div className="page-loading">Loading admin data...</div>;

  return (
    <div className="page admin-page">
      <h1>Admin Dashboard — Cee4 Collections</h1>
      <div className="admin-tabs">
        <button className={tab === 'overview' ? 'tab-active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'products' ? 'tab-active' : ''} onClick={() => setTab('products')}>Products</button>
        <button className={tab === 'users' ? 'tab-active' : ''} onClick={() => setTab('users')}>Users</button>
        <button className={tab === 'orders' ? 'tab-active' : ''} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card"><h3>{orders.length}</h3><p>Total Orders</p></div>
          <div className="stat-card"><h3>{products.filter((p) => p.status === 'pending').length}</h3><p>Pending Approvals</p></div>
          <div className="stat-card"><h3>₦{totalRevenue.toLocaleString()}</h3><p>Revenue (Paid)</p></div>
          <div className="stat-card"><h3>{products.length}</h3><p>Products Listed</p></div>
        </div>
      )}

      {tab === 'products' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Name</th><th>Vendor Email</th><th>Price</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover' }} /></td>
                  <td>{p.name}</td>
                  <td>{p.profiles?.email || 'Unknown'}</td>
                  <td>₦{Number(p.price).toLocaleString()}</td>
                  <td>
                    <span style={{ color: p.status === 'approved' ? 'green' : 'orange', fontWeight: 'bold' }}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {p.status === 'pending' && (
                      <button onClick={() => handleApprove(p.id)} style={{ marginRight: '8px', color: 'green' }}>Approve</button>
                    )}
                    <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Area</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ opacity: u.banned ? 0.5 : 1 }}>
                  <td>{u.full_name || 'N/A'}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      disabled={u.id === currentUserId}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>{u.area || 'N/A'}</td>
                  <td>
                    {u.banned ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>BANNED</span>
                    ) : (
                      <span style={{ color: 'green' }}>Active</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleBan(u)}
                      disabled={u.id === currentUserId}
                      style={{ color: u.banned ? 'green' : 'red' }}
                    >
                      {u.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
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
                <tr>
                  <th>Order #</th><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Area</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{order.recipient_name || 'N/A'}</td>
                    <td>₦{Number(order.total).toLocaleString()}</td>
                    <td>
                      {order.payment_method === 'paystack' ? 'Paystack' : 'On Delivery'} ({order.payment_status})
                    </td>
                    <td>{order.delivery_area}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
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