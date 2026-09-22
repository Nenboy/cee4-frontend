import { useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadProduct } from '../lib/products';

export default function UploadProduct() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      await uploadProduct(file, { ...form, price: Number(form.price) });
      setMessage('Product submitted for review. You will be notified once it is approved.');
      setForm({ name: '', description: '', price: '', category: '' });
      setFile(null);
      setPreview(null);
      e.target.reset();
    } catch (err) {
      setMessage(err.message || 'Upload failed.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Upload Product</h1>
          <Link to="/my-products" style={{ fontSize: '14px' }}>Back to My Products</Link>
        </div>
        <p className="muted" style={{ marginBottom: '1.5rem', fontSize: '14px' }}>
          Fill in the details below. Your product will be reviewed by an admin before appearing in the shop.
        </p>
        <label>
          Product Name
          <input placeholder="e.g. Ankara Two-Piece Set" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Description
          <textarea placeholder="Describe the material, fit, size, and any other details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
        </label>
        <label>
          Price (N)
          <input type="number" placeholder="e.g. 15000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" />
        </label>
        <label>
          Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select a category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
          </select>
        </label>
        <label>
          Product Image
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>
        {preview && (
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Preview:</p>
            <img src={preview} alt="Product preview" style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
        )}
        {message && <p className={isError ? 'error-text' : ''} style={!isError ? { color: 'green', fontSize: '14px' } : {}}>{message}</p>}
        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit Product for Review'}
        </button>
      </form>
    </div>
  );
}
