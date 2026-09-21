import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(false);
    client.get(`/products/${slug}`).then((res) => {
      setProduct(res.data);
      setSize(res.data.sizes?.[0] || '');
      setColor(res.data.colors?.[0] || '');
    });
  }, [slug]);

  if (!product) return <div className="page">Loading...</div>;

  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);

  const handleAddToCart = () => {
    addItem(product, { size, color, quantity });
    setAdded(true);
  };

  const handleBuyNow = () => {
    addItem(product, { size, color, quantity });
    navigate('/cart');
  };

  return (
    <div className="page product-detail">
      <div className="product-detail-image">
        {product.image ? <img src={product.image} alt={product.name} /> : <div className="image-placeholder large">No image</div>}
      </div>

      <div className="product-detail-info">
        <p className="breadcrumb">{product.category?.name}</p>
        <h1>{product.name}</h1>

        <div className="price-row">
          {hasDiscount ? (
            <>
              <span className="price-now">₦{Number(product.discount_price).toLocaleString()}</span>
              <span className="price-was">₦{Number(product.price).toLocaleString()}</span>
            </>
          ) : (
            <span className="price-now">₦{Number(product.price).toLocaleString()}</span>
          )}
        </div>

        <p className="description">{product.description}</p>

        {product.sizes?.length > 0 && (
          <div className="option-group">
            <label>Size</label>
            <div className="option-pills">
              {product.sizes.map((s) => (
                <button key={s} className={s === size ? 'pill-active' : ''} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="option-group">
            <label>Color</label>
            <div className="option-pills">
              {product.colors.map((c) => (
                <button key={c} className={c === color ? 'pill-active' : ''} onClick={() => setColor(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="option-group">
          <label>Quantity</label>
          <div className="qty-stepper">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
        </div>

        <p className="stock-note">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

        <div className="product-actions">
          <button className="btn-outline" onClick={handleAddToCart} disabled={product.stock === 0}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
          <button className="btn-primary" onClick={handleBuyNow} disabled={product.stock === 0}>
            Buy Now
          </button>
        </div>

        <p className="delivery-note">🚚 Delivered within Jos only. Delivery fee calculated at checkout.</p>
      </div>
    </div>
  );
}
