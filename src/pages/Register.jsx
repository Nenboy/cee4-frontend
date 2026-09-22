import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deliveryAreas } from '../api/mockData';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', address: '', area: deliveryAreas[0],
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      // FIXED: Supabase throws standard JS errors, not Axios errors
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <label>
          Full Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Address
          <input name="address" value={form.address} onChange={handleChange} />
        </label>
        <label>
          Area within Jos
          <select name="area" value={form.area} onChange={handleChange}>
            {deliveryAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </label>
        <label>
          Confirm Password
          <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary full-width" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}