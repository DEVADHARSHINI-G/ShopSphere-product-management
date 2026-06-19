const bcrypt = require('bcryptjs');

function seedDatabase(db) {
  console.log('🌱 Seeding database with sample data...');

  // --- Seed Admin User ---
  const hashedPassword = bcrypt.hashSync('Admin@123', 10);
  const userPassword = bcrypt.hashSync('User@123', 10);

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );

  insertUser.run('Admin', 'admin@shopsphere.com', hashedPassword, 'admin');
  insertUser.run('Deva', 'deva@shopsphere.com', userPassword, 'user');
  insertUser.run('John Doe', 'john@example.com', userPassword, 'user');
  insertUser.run('Jane Smith', 'jane@example.com', userPassword, 'user');

  // --- Seed Categories ---
  const insertCategory = db.prepare(
    'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)'
  );

  const categories = [
    ['Electronics', 'Latest gadgets and electronic devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'],
    ['Fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'],
    ['Home & Living', 'Beautiful home decor and furniture', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    ['Sports & Fitness', 'Equipment for an active lifestyle', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'],
    ['Books', 'Best sellers and new releases', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'],
    ['Beauty & Health', 'Skincare, makeup, and wellness products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400']
  ];

  categories.forEach(cat => insertCategory.run(...cat));

  // --- Seed Products ---
  const insertProduct = db.prepare(
    'INSERT INTO products (name, description, price, image, category_id, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const products = [
    // Electronics (category_id: 1)
    ['Wireless Noise-Cancelling Headphones', 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1, 50, 4.8],
    ['Ultra-Slim Laptop Pro', 'Powerful 15-inch laptop with M2 chip, 16GB RAM, 512GB SSD. Perfect for professionals and creators.', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 1, 25, 4.9],
    ['Smart Watch Series X', 'Advanced smartwatch with health monitoring, GPS, and 5-day battery life. Water resistant to 50m.', 399.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 1, 100, 4.6],
    ['4K Action Camera', 'Compact waterproof action camera with 4K@60fps recording, image stabilization, and wide-angle lens.', 249.99, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', 1, 75, 4.5],
    ['Bluetooth Portable Speaker', 'Powerful portable speaker with 360° surround sound, waterproof design, and 20-hour playtime.', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 1, 200, 4.4],

    // Fashion (category_id: 2)
    ['Premium Leather Jacket', 'Handcrafted genuine leather jacket with quilted lining. Timeless style that never goes out of fashion.', 189.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 2, 40, 4.7],
    ['Designer Sunglasses', 'UV400 polarized sunglasses with titanium frame. Lightweight and elegant for everyday wear.', 129.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 2, 80, 4.3],
    ['Classic Canvas Sneakers', 'Versatile canvas sneakers with cushioned insole and durable rubber outsole. Available in 8 colors.', 59.99, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400', 2, 150, 4.5],
    ['Silk Evening Dress', 'Elegant floor-length silk dress with a modern silhouette. Perfect for formal occasions and galas.', 249.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 2, 30, 4.8],

    // Home & Living (category_id: 3)
    ['Minimalist Desk Lamp', 'Adjustable LED desk lamp with wireless charging base, touch controls, and 5 brightness levels.', 69.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 3, 120, 4.6],
    ['Luxury Scented Candle Set', 'Set of 4 hand-poured soy candles with premium fragrances. Each candle burns for 45+ hours.', 44.99, 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400', 3, 200, 4.4],
    ['Ergonomic Office Chair', 'Premium mesh office chair with lumbar support, adjustable armrests, and breathable design.', 449.99, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400', 3, 35, 4.7],
    ['Ceramic Plant Pots Set', 'Set of 3 modern ceramic planters with bamboo saucers. Perfect for succulents and small plants.', 34.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 3, 90, 4.2],

    // Sports & Fitness (category_id: 4)
    ['Premium Yoga Mat', 'Extra-thick 6mm non-slip yoga mat with alignment markers and carrying strap. Eco-friendly materials.', 49.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 4, 150, 4.5],
    ['Adjustable Dumbbell Set', 'Space-saving adjustable dumbbells from 5-52.5 lbs. Quick-change weight system for efficient workouts.', 349.99, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 4, 45, 4.8],
    ['Running Shoes Ultra', 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and carbon fiber plate.', 159.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 4, 100, 4.6],

    // Books (category_id: 5)
    ['The Art of Innovation', 'A bestselling guide to creative thinking and problem-solving in business and life.', 24.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 5, 300, 4.3],
    ['Modern Web Development', 'Comprehensive guide covering HTML5, CSS3, JavaScript, React, Node.js, and cloud deployment.', 39.99, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 5, 250, 4.7],
    ['Digital Photography Masterclass', 'From beginner to professional — master composition, lighting, editing, and storytelling through images.', 29.99, 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=400', 5, 180, 4.5],

    // Beauty & Health (category_id: 6)
    ['Luxury Skincare Set', 'Complete skincare routine: cleanser, toner, serum, moisturizer. Formulated with hyaluronic acid and vitamin C.', 89.99, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', 6, 80, 4.6],
    ['Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser with 7 LED mood lights and auto shut-off. Covers up to 300 sq ft.', 39.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400', 6, 120, 4.4],
    ['Professional Hair Dryer', 'Ionic hair dryer with 3 heat settings, cool shot button, and concentrator nozzle. Reduces drying time by 50%.', 79.99, 'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=400', 6, 65, 4.5],
  ];

  products.forEach(prod => insertProduct.run(...prod));

  // --- Seed Sample Orders ---
  const insertOrder = db.prepare(
    'INSERT INTO orders (user_id, items, total, status) VALUES (?, ?, ?, ?)'
  );

  insertOrder.run(2, JSON.stringify([
    { product_id: 1, name: 'Wireless Noise-Cancelling Headphones', quantity: 1, price: 299.99 },
    { product_id: 3, name: 'Smart Watch Series X', quantity: 1, price: 399.99 }
  ]), 699.98, 'delivered');

  insertOrder.run(3, JSON.stringify([
    { product_id: 6, name: 'Premium Leather Jacket', quantity: 1, price: 189.99 }
  ]), 189.99, 'shipped');

  insertOrder.run(2, JSON.stringify([
    { product_id: 10, name: 'Minimalist Desk Lamp', quantity: 2, price: 69.99 },
    { product_id: 11, name: 'Luxury Scented Candle Set', quantity: 1, price: 44.99 }
  ]), 184.97, 'processing');

  console.log('✅ Database seeded successfully!');
  console.log('   - 4 users (1 admin, 3 regular)');
  console.log('   - 6 categories');
  console.log('   - 23 products');
  console.log('   - 3 sample orders');
}

module.exports = { seedDatabase };
