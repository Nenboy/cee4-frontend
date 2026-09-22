import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApprovedProducts } from '../lib/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { slug: 'men', name: 'Men' },
  { slug: 'women', name: 'Women' },
  { slug: 'kids', name: 'Kids' },
  { slug: 'accessories', name: 'Accessories' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    setError('');
    getApprovedProducts({ category, search, sort })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="page shop-page">
      <aside className="shop-filters">
        <h3>Categories</h3>
        <button
          className={!category ? 'filter-active' : ''}
          onClick={() => updateParam('category', '')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className={category === cat.slug ? 'filter-active' : ''}
            onClick={() => updateParam('category', cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </aside>

      <main className="shop-main">
        <div className="shop-toolbar">
          <input
            type="text"
            placeholder="Search clothing..."
            defaultValue={search}
            onKeyDown={(e) => e.key === 'Enter' && updateParam('search', e.target.value)}
          />
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}