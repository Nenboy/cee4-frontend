import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    client.get('/products', { params: { featured: 1, per_page: 8 } })
      .then((res) => setFeatured(res.data.data));
    client.get('/categories').then((res) => setCategories(res.data));
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
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="category-tile">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
