// Mock "backend" for local development.
// Exposes the same shape as an axios instance (get/post/patch each return
// a Promise resolving to { data }), so every page written against this file
// can later point at a real Node/Express + MongoDB API by swapping this
// import for a real axios client — no page logic needs to change.

import { categories, products, DELIVERY_FEE } from './mockData';

const DELAY = 300; // simulate network latency

function wait(data) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), DELAY));
}
function fail(status, message) {
  return new Promise((_, reject) =>
    setTimeout(() => reject({ response: { status, data: { message } } }), DELAY)
  );
}

// ---- fake persistent "DB" in localStorage ----
function loadUsers() {
  const saved = localStorage.getItem('cee4_mock_users');
  if (saved) return JSON.parse(saved);
  const seeded = [
    { id: 1, name: 'Cee4 Admin', email: 'admin@cee4collections.com', password: 'password', role: 'admin', phone: '', address: '', area: 'Jos' },
    { id: 2, name: 'Test Customer', email: 'customer@example.com', password: 'password', role: 'customer', phone: '', address: '', area: 'Bukuru' },
  ];
  localStorage.setItem('cee4_mock_users', JSON.stringify(seeded));
  return seeded;
}
function saveUsers(users) {
  localStorage.setItem('cee4_mock_users', JSON.stringify(users));
}
function loadOrders() {
  const saved = localStorage.getItem('cee4_mock_orders');
  return saved ? JSON.parse(saved) : [];
}
function saveOrders(orders) {
  localStorage.setItem('cee4_mock_orders', JSON.stringify(orders));
}
function currentUser() {
  const saved = localStorage.getItem('cee4_user');
  return saved ? JSON.parse(saved) : null;
}

const client = {
  async get(url, config = {}) {
    const params = config.params || {};

    // ---- Products ----
    if (url === '/products') {
      let list = products.filter((p) => p.is_active);
      if (params.category) list = list.filter((p) => p.category.slug === params.category);
      if (params.search) list = list.filter((p) => p.name.toLowerCase().includes(params.search.toLowerCase()));
      if (params.min_price) list = list.filter((p) => p.price >= params.min_price);
      if (params.max_price) list = list.filter((p) => p.price <= params.max_price);
      if (params.featured) list = list.filter((p) => p.is_featured);
      if (params.sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
      if (params.sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
      return wait({ data: list, total: list.length, current_page: 1 });
    }

    if (url.startsWith('/products/')) {
      const slug = url.split('/products/')[1];
      const product = products.find((p) => p.slug === slug);
      if (!product) return fail(404, 'Product not found');
      return wait(product);
    }

    // ---- Categories ----
    if (url === '/categories') {
      return wait(categories);
    }
    if (url.startsWith('/categories/')) {
      const slug = url.split('/categories/')[1];
      const category = categories.find((c) => c.slug === slug);
      if (!category) return fail(404, 'Category not found');
      return wait({ ...category, products: products.filter((p) => p.category.slug === slug) });
    }

    // ---- Auth ----
    if (url === '/me') {
      const user = currentUser();
      if (!user) return fail(401, 'Unauthenticated');
      return wait(user);
    }

    // ---- Orders ----
    if (url === '/orders') {
      const user = currentUser();
      if (!user) return fail(401, 'Unauthenticated');
      const orders = loadOrders().filter((o) => o.user_id === user.id);
      return wait(orders.reverse());
    }
    if (url.startsWith('/orders/')) {
      const id = Number(url.split('/orders/')[1]);
      const order = loadOrders().find((o) => o.id === id);
      if (!order) return fail(404, 'Order not found');
      return wait(order);
    }

    // ---- Payment verify (simulated Paystack test success) ----
    if (url.startsWith('/payments/verify/')) {
      const reference = url.split('/payments/verify/')[1];
      const orders = loadOrders();
      const order = orders.find((o) => o.payment_reference === reference);
      if (order) {
        order.payment_status = 'paid';
        order.status = 'processing';
        saveOrders(orders);
      }
      return wait({ status: 'success', order });
    }

    return fail(404, `Mock route not found: GET ${url}`);
  },

  async post(url, body = {}) {
    // ---- Auth ----
    if (url === '/register') {
      const users = loadUsers();
      if (users.some((u) => u.email === body.email)) {
        return fail(422, 'Email already registered');
      }
      const newUser = {
        id: users.length + 1,
        name: body.name,
        email: body.email,
        password: body.password,
        role: 'customer',
        phone: body.phone || '',
        address: body.address || '',
        area: body.area || '',
      };
      users.push(newUser);
      saveUsers(users);
      const { password, ...safeUser } = newUser;
      return wait({ user: safeUser, token: 'mock-token-' + newUser.id });
    }

    if (url === '/login') {
      const users = loadUsers();
      const found = users.find((u) => u.email === body.email && u.password === body.password);
      if (!found) return fail(422, 'The provided credentials are incorrect.');
      const { password, ...safeUser } = found;
      return wait({ user: safeUser, token: 'mock-token-' + found.id });
    }

    if (url === '/logout') {
      return wait({ message: 'Logged out' });
    }

    // ---- Orders ----
    if (url === '/orders') {
      const user = currentUser();
      if (!user) return fail(401, 'Unauthenticated');

      const subtotal = body.items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.product_id);
        const price = product?.discount_price ?? product?.price ?? 0;
        return sum + price * item.quantity;
      }, 0);

      const orders = loadOrders();
      const order = {
        id: orders.length + 1,
        order_number: 'CEE4-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        user_id: user.id,
        items: body.items.map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return {
            product_id: item.product_id,
            product_name: product?.name,
            price: product?.discount_price ?? product?.price ?? 0,
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity,
          };
        }),
        recipient_name: body.recipient_name,
        recipient_phone: body.recipient_phone,
        delivery_address: body.delivery_address,
        delivery_area: body.delivery_area,
        subtotal,
        delivery_fee: DELIVERY_FEE,
        total: subtotal + DELIVERY_FEE,
        payment_method: body.payment_method,
        payment_status: 'pending',
        status: 'pending',
        notes: body.notes || '',
        created_at: new Date().toISOString(),
      };
      orders.push(order);
      saveOrders(orders);
      return wait(order);
    }

    // ---- Simulated Paystack init ----
    if (url.match(/^\/orders\/\d+\/pay$/)) {
      const id = Number(url.split('/orders/')[1].split('/pay')[0]);
      const orders = loadOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) return fail(404, 'Order not found');

      const reference = 'CEE4_MOCK_' + Math.random().toString(36).slice(2, 12).toUpperCase();
      order.payment_reference = reference;
      saveOrders(orders);

      // In the real app this becomes Paystack's authorization_url.
      // Here we route to our own in-app mock checkout page instead.
      return wait({
        authorization_url: `/payment/mock-checkout?reference=${reference}&order=${order.id}`,
        reference,
      });
    }

    return fail(404, `Mock route not found: POST ${url}`);
  },

  async patch(url, body = {}) {
    if (url.startsWith('/orders/')) {
      const id = Number(url.split('/orders/')[1]);
      const orders = loadOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) return fail(404, 'Order not found');
      Object.assign(order, body);
      saveOrders(orders);
      return wait(order);
    }
    return fail(404, `Mock route not found: PATCH ${url}`);
  },
};

export default client;
