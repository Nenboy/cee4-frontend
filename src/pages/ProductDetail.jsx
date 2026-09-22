import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../lib/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setAdded(false);
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error-text">Error: {error}</div>;
  if (!product) return <div className="page">Product not found.</div>;

  const handleAddToCart = () => {
    addItem(product, { quantity });
    setAdded(true);
  };

  const handleBuyNow = () => {
    addItem(product, { quantity });
    navigate('/cart');
  };

  return (
    <div className="page product-detail">
      <div className="product-detail-image">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} />
          : <div className="image-placeholder large">No image</div>}
      </div>

      <div className="product-detail-info">
        <p className="breadcrumb">{product.category}</p>
        <h1>{product.name}</h1>

        <div className="price-row">
          <span className="price-now">₦{Number(product.price).toLocaleString()}</span>
        </div>

        <p className="description">{product.description}</p>

        <div className="option-group">
          <label>Quantity</label>
          <div className="qty-stepper">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
        </div>

        <div className="product-actions">
          <button className="btn-outline" onClick={handleAddToCart}>
            {added ? 'Added' : 'Add to Cart'}
          </button>
          <button className="btn-primary" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>

        <p className="delivery-note">Delivered within Jos only. Delivery fee calculated at checkout.</p>
      </div>
    </div>
  );
}