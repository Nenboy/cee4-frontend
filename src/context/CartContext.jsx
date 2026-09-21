import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

// Cart items are keyed by product id + size + color, so the same shirt in
// two sizes is tracked as two separate lines.
function lineKey(item) {
  return `${item.product_id}-${item.size || ''}-${item.color || ''}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cee4_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cee4_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, { size, color, quantity = 1 } = {}) => {
    const newItem = {
      product_id: product.id,
      name: product.name,
      image: product.image,
      price: Number(product.discount_price ?? product.price),
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
