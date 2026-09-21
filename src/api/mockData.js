// Mock catalog data for Cee4 Collections.
// Shaped to match what the future MongoDB/Express API will return, so
// swapping mockClient.js for a real axios client later requires no changes
// to any page/component.

export const categories = [
  { id: 'men', name: 'Men', slug: 'men', products_count: 4 },
  { id: 'women', name: 'Women', slug: 'women', products_count: 4 },
  { id: 'kids', name: 'Kids', slug: 'kids', products_count: 2 },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', products_count: 2 },
];

export const products = [
  {
    id: 1, category_id: 'men', category: { name: 'Men', slug: 'men' },
    name: 'Men Classic T-Shirt', slug: 'men-classic-t-shirt',
    description: 'Soft cotton crew-neck tee, perfect for everyday wear around Jos.',
    price: 6500, discount_price: 5500, image: "/images/products/hopev2.jpg",
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy'],
    stock: 30, is_featured: true, is_active: true,
  },
  {
    id: 2, category_id: 'men', category: { name: 'Men', slug: 'men' },
    name: 'Men Formal Shirt', slug: 'men-formal-shirt',
    description: 'Crisp long-sleeve shirt for office or church wear.',
    price: 12000, discount_price: 11000, image:"/images/products/bodo.jpg",
    sizes: ['M', 'L', 'XL'], colors: ['White', 'Sky Blue'],
    stock: 18, is_featured: false, is_active: true,
  },
  {
    id: 3, category_id: 'men', category: { name: 'Men', slug: 'men' },
    name: 'Men Native Wear (Senator)', slug: 'men-native-senator',
    description: 'Well-tailored senator wear, great for owambe and special occasions.',
    price: 25000, discount_price: 21000, image: null,
    sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Black', 'Wine'],
    stock: 10, is_featured: true, is_active: true,
  },
  {
    id: 4, category_id: 'men', category: { name: 'Men', slug: 'men' },
    name: 'Men Chinos Trousers', slug: 'men-chinos-trousers',
    description: 'Comfortable slim-fit chinos, versatile for work or weekend.',
    price: 9500, discount_price: null, image: null,
    sizes: ['30', '32', '34', '36'], colors: ['Khaki', 'Black', 'Navy'],
    stock: 22, is_featured: false, is_active: true,
  },
  {
    id: 5, category_id: 'women', category: { name: 'Women', slug: 'women' },
    name: 'Women Ankara Gown', slug: 'women-ankara-gown',
    description: 'Vibrant Ankara print gown, made locally with quality fabric.',
    price: 18000, discount_price: 15500, image: null,
    sizes: ['S', 'M', 'L'], colors: ['Multicolor'],
    stock: 14, is_featured: true, is_active: true,
  },
  {
    id: 6, category_id: 'women', category: { name: 'Women', slug: 'women' },
    name: 'Women Blouse', slug: 'women-blouse',
    description: 'Elegant fitted blouse, easy to pair with skirts or trousers.',
    price: 7500, discount_price: null, image: null,
    sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Pink', 'Black'],
    stock: 25, is_featured: false, is_active: true,
  },
  {
    id: 7, category_id: 'women', category: { name: 'Women', slug: 'women' },
    name: 'Women Pencil Skirt', slug: 'women-pencil-skirt',
    description: 'Office-ready pencil skirt with a flattering fit.',
    price: 8500, discount_price: 7000, image: null,
    sizes: ['S', 'M', 'L'], colors: ['Black', 'Grey'],
    stock: 16, is_featured: false, is_active: true,
  },
  {
    id: 8, category_id: 'women', category: { name: 'Women', slug: 'women' },
    name: 'Women Ankara Jumpsuit', slug: 'women-ankara-jumpsuit',
    description: 'Trendy jumpsuit in bold Ankara print, stands out anywhere.',
    price: 16500, discount_price: null, image: null,
    sizes: ['S', 'M', 'L'], colors: ['Multicolor'],
    stock: 9, is_featured: true, is_active: true,
  },
  {
    id: 9, category_id: 'kids', category: { name: 'Kids', slug: 'kids' },
    name: 'Kids T-Shirt', slug: 'kids-t-shirt',
    description: 'Comfy cotton tee for active kids.',
    price: 3500, discount_price: null, image: null,
    sizes: ['4-5Y', '6-7Y', '8-9Y'], colors: ['Red', 'Blue', 'Yellow'],
    stock: 40, is_featured: false, is_active: true,
  },
  {
    id: 10, category_id: 'kids', category: { name: 'Kids', slug: 'kids' },
    name: 'Kids Shorts', slug: 'kids-shorts',
    description: 'Durable everyday shorts for play and school.',
    price: 4000, discount_price: 3200, image: null,
    sizes: ['4-5Y', '6-7Y', '8-9Y'], colors: ['Navy', 'Grey'],
    stock: 35, is_featured: false, is_active: true,
  },
  {
    id: 11, category_id: 'accessories', category: { name: 'Accessories', slug: 'accessories' },
    name: 'Leather Belt', slug: 'leather-belt',
    description: 'Genuine leather belt, a wardrobe essential.',
    price: 5000, discount_price: null, image: null,
    sizes: ['One Size'], colors: ['Black', 'Brown'],
    stock: 28, is_featured: false, is_active: true,
  },
  {
    id: 12, category_id: 'accessories', category: { name: 'Accessories', slug: 'accessories' },
    name: 'Classic Cap', slug: 'classic-cap',
    description: 'Adjustable cap to complete any casual outfit.',
    price: 3000, discount_price: 2500, image: null,
    sizes: ['One Size'], colors: ['Black', 'Navy', 'Grey'],
    stock: 32, is_featured: true, is_active: true,
  },
];

// Areas within Jos that Cee4 Collections currently delivers to
export const deliveryAreas = [
  'Jos North (Terminus)', 'Jos South (Bukuru)', 'Jos East',
  'Rayfield', 'Angwan Rukuba', 'Gada Biu', 'Zaria Road', 'BOB Chalet Area',
];

export const DELIVERY_FEE = 1000;
