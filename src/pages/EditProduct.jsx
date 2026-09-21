import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductForVendor, updateProduct, deleteProduct } from '../lib/products';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getProductForVendor(id)
      .then((p) => {
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price ?? '',
          category: p.category || '',
        });
        setExistingImage(p.image_url || '');
      })
      .catch((err) => {
        setMessage(err.message);
        setIsError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);

    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        // Changing content sends it back for review
        status: 'pending',
      });
      setMessage('Product updated. It will need to be re-approved by an admin.');
    } catch (err) {
      setMessage(err.message || 'Update failed.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this product permanently? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      navigate('/my-products');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  }

  if (loading) return <div className="page-loading">Loading product...</div>;

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Edit Product</h1>
          <Link to="/my-products" style={{ fontSize: '14px' }}>Back to My Products</Link>
        </div>

        <p className="muted" style={{ marginBottom: '1.5rem', fontSize: '14px' }}>
          Any changes you make will send the product back for admin review.
        </p>

        {existingImage && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Current image:</p>
            <img
              src={existingImage}
              alt="Current product"
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
          </div>
        )}

        <label>
          Product Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
        </label>

        <label>
          Price (₦)
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
          </select>
        </label>

        {message && (
          <p className={isError ? 'error-text' : ''} style={!isError ? { color: 'green', fontSize: '14px' } : {}}>
            {message}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn-primary full-width" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{ color: 'red', whiteSpace: 'nowrap' }}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}