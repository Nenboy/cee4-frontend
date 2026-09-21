import { useState } from 'react'
import { uploadProduct } from '../lib/products'

export default function UploadProduct() {
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await uploadProduct(file, { ...form, price: Number(form.price) })
      setMessage('✅ Product submitted for review!')
      setForm({ name: '', description: '', price: '', category: '' })
      setFile(null)
    } catch (err) {
      setMessage('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Product name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} required />

      <textarea placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <input type="number" placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })} required />

      <input placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })} />

      <input type="file" accept="image/*"
        onChange={(e) => setFile(e.target.files[0])} required />

      <button disabled={loading}>{loading ? 'Uploading...' : 'Submit Product'}</button>
      {message && <p>{message}</p>}
    </form>
  )
}