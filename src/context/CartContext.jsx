import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

// Bump this when the cart item shape changes so old carts are wiped clean.
const CART_VERSION = 2;
const STORAGE_KEY = 'cee4_cart';
const VERSION_KEY = 'cee4_cart_version';

function lineKey(item) {
  return `${item.product_id}-${item.size || ''}-${item.color || ''}`;
}

function loadInitialCart() {
  try {
    const storedVersion = Number(localStorage.getItem(VERSION_KEY) || 0);
    if (storedVersion !== CART_VERSION) {
      // Cart shape changed — discard old items
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(CART_VERSION));
      return [];
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    // Defensive: drop any item missing required fields
    return parsed.filter((i) => i && i.product_id && i.name && typeof i.price === 'number');
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write errors (e.g. private mode)
    }
  }, [items]);

  const addItem = (product, { size, color, quantity = 1 } = {}) => {
    const newItem = {
      product_id: product.id,
      name: product.name,
      image: product.image_url || product.image || null,
      price: Number(product.price),
      size: size || null,
      color: color || null,
      quantity,
    };

    setItems((prev) => {
      const key = lineKey(newItem);
      const existing = prev.find((i) => lineKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (item, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (lineKey(i) === lineKey(item) ? { ...i, quantity } : i))
    );
  };

  const removeItem = (item) => {
    setItems((prev) => prev.filter((i) => lineKey(i) !== lineKey(item)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);