import { Link } from 'react-router-dom';

const IMG_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '') + '/storage/';

export default function ProductCard({ product }) {
  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
        {hasDiscount && <span className="sale-tag">Sale</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
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
      </div>
    </Link>
  );
}
