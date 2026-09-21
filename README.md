# Cee4 Collections — Frontend (React)

Clothing e-commerce storefront for Cee4 Collections, delivering within Jos.
Built with React + Vite + React Router.

## Current state: fully working with MOCK data

This app runs **completely standalone right now** — no backend required.
All products, categories, accounts, and orders are simulated in
`src/api/mockClient.js` and persisted to the browser's `localStorage`, so
you can register, log in, shop, check out (both payment methods), and view
the admin dashboard immediately.

## 1. Install

```bash
npm install
```

## 2. Run

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Test accounts (seeded automatically)

| Role | Email | Password |
|---|---|---|
| Admin | admin@cee4collections.com | password |
| Customer | customer@example.com | password |

(Or just register a new account — it's saved locally too.)

## What you can test right now

- Browse clothing by category (Men, Women, Kids, Accessories), search, sort by price
- View product detail, pick size/color, add to cart
- Checkout with **Pay on Delivery** (Jos-only delivery areas) — instant order confirmation
- Checkout with **Pay Online (Paystack test mode)** — routes to an in-app mock
  Paystack screen; use the test card shown on that screen to simulate a
  successful payment
- View order history as a customer
- Log in as admin → `/admin` to see order/revenue stats, the product catalog,
  and update order status (pending → processing → out for delivery → delivered)

## Connecting the real backend later

Everything the app needs from a backend goes through **one file**:
`src/api/client.js`. It currently exports the mock client. When the
Node/Express + MongoDB API is ready:

1. Set `VITE_API_URL` in a `.env` file to your API's base URL.
2. In `src/api/client.js`, comment out the mock import/export and uncomment
   the real axios client below it (already written and ready to go).
3. Nothing else changes — every page already calls `client.get/post/patch`
   using the same endpoint shapes (`/products`, `/orders`, `/login`, etc.),
   so the real API just needs to return matching JSON shapes.

See `src/api/mockClient.js` for the exact request/response shape each
endpoint expects — treat it as the API spec for the backend build.
