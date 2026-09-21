import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProducts, deleteProduct } from '../lib/products';

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  if (loading) return <div className="page-loading">Loading your products...</div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>My Products</h1>
        <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Upload New Product
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>You have not uploaded any products yet.</p>
          <Link to="/upload">Upload your first product</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td data-label="Image">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#999' }}>No image</span>
                    )}
                  </td>
                  <td data-label="Name">{p.name}</td>
                  <td data-label="Category">{p.category}</td>
                  <td data-label="Price">₦{Number(p.price).toLocaleString()}</td>
                  <td data-label="Status">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: p.status === 'approved' ? '#e6f4ea' : p.status === 'pending' ? '#fef7e0' : '#fce8e6',
                      color: p.status === 'approved' ? '#137333' : p.status === 'pending' ? '#b06000' : '#c5221f'
                    }}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <Link to={`/edit-product/${p.id}`} style={{ marginRight: '12px' }}>Edit</Link>
                    <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}