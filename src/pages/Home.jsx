import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedProducts } from '../lib/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { slug: 'men', name: 'Men' },
  { slug: 'women', name: 'Women' },
  { slug: 'kids', name: 'Kids' },
  { slug: 'accessories', name: 'Accessories' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getApprovedProducts({ sort: 'newest' })
      .then((data) => setFeatured(data.slice(0, 8)))
      .catch(console.error);
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Cee4 Collections</h1>
          <p>Quality clothing, delivered anywhere within Jos.</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </section>

      <section className="section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="category-tile">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Featured Products</h2>
        {featured.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}