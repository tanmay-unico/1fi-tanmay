const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'emi_products',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function initDatabase() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(100),
        brand VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(100),
        storage VARCHAR(50),
        mrp DECIMAL(10, 2) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS emi_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tenure_months INTEGER NOT NULL,
        interest_rate DECIMAL(5, 2) NOT NULL,
        cashback DECIMAL(10, 2) DEFAULT 0,
        cashback_description TEXT,
        min_amount DECIMAL(10, 2) DEFAULT 0,
        max_amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully');

    // Insert sample products
    const products = [
      {
        name: 'Apple iPhone 17 Pro',
        slug: 'apple-iphone-17-pro',
        description: 'The latest iPhone with advanced features and cutting-edge technology',
        category: 'Smartphones',
        brand: 'Apple',
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Premium Android smartphone with S Pen and advanced camera system',
        category: 'Smartphones',
        brand: 'Samsung',
      },
      {
        name: 'OnePlus 12',
        slug: 'oneplus-12',
        description: 'Flagship killer with blazing fast performance and premium design',
        category: 'Smartphones',
        brand: 'OnePlus',
      },
    ];

    for (const product of products) {
      const productResult = await pool.query(
        'INSERT INTO products (name, slug, description, category, brand) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (slug) DO NOTHING RETURNING id',
        [product.name, product.slug, product.description, product.category, product.brand]
      );

      if (productResult.rows.length > 0) {
        const productId = productResult.rows[0].id;

        // Insert variants for each product
        let variants = [];
        if (product.slug === 'apple-iphone-17-pro') {
          variants = [
            { name: '256GB - Silver', color: 'Silver', storage: '256GB', mrp: 134900, price: 124900, image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500' },
            { name: '256GB - Space Black', color: 'Space Black', storage: '256GB', mrp: 134900, price: 124900, image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500' },
            { name: '512GB - Silver', color: 'Silver', storage: '512GB', mrp: 154900, price: 144900, image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500' },
            { name: '512GB - Space Black', color: 'Space Black', storage: '512GB', mrp: 154900, price: 144900, image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500' },
          ];
        } else if (product.slug === 'samsung-galaxy-s24-ultra') {
          variants = [
            { name: '256GB - Titanium Black', color: 'Titanium Black', storage: '256GB', mrp: 124999, price: 114999, image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500' },
            { name: '256GB - Titanium Gray', color: 'Titanium Gray', storage: '256GB', mrp: 124999, price: 114999, image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500' },
            { name: '512GB - Titanium Black', color: 'Titanium Black', storage: '512GB', mrp: 134999, price: 124999, image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500' },
          ];
        } else if (product.slug === 'oneplus-12') {
          variants = [
            { name: '256GB - Silky Black', color: 'Silky Black', storage: '256GB', mrp: 64999, price: 59999, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
            { name: '256GB - Flowy Emerald', color: 'Flowy Emerald', storage: '256GB', mrp: 64999, price: 59999, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
            { name: '512GB - Silky Black', color: 'Silky Black', storage: '512GB', mrp: 69999, price: 64999, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
          ];
        }

        for (const variant of variants) {
          await pool.query(
            'INSERT INTO variants (product_id, name, color, storage, mrp, price, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [productId, variant.name, variant.color, variant.storage, variant.mrp, variant.price, variant.image_url, 10]
          );
        }
      }
    }

    // Insert EMI plans
    const emiPlans = [
      { name: '3 Months - 0% Interest', tenure_months: 3, interest_rate: 0, cashback: 0, cashback_description: null, min_amount: 0 },
      { name: '6 Months - 0% Interest', tenure_months: 6, interest_rate: 0, cashback: 0, cashback_description: null, min_amount: 0 },
      { name: '9 Months - 10.5% Interest', tenure_months: 9, interest_rate: 10.5, cashback: 0, cashback_description: null, min_amount: 0 },
      { name: '12 Months - 10.5% Interest', tenure_months: 12, interest_rate: 10.5, cashback: 500, cashback_description: 'Get ₹500 cashback', min_amount: 0 },
      { name: '18 Months - 12% Interest', tenure_months: 18, interest_rate: 12, cashback: 1000, cashback_description: 'Get ₹1000 cashback', min_amount: 0 },
      { name: '24 Months - 12% Interest', tenure_months: 24, interest_rate: 12, cashback: 2000, cashback_description: 'Get ₹2000 cashback', min_amount: 0 },
    ];

    // Clear existing EMI plans to avoid duplicates
    await pool.query('DELETE FROM emi_plans');

    for (const plan of emiPlans) {
      await pool.query(
        'INSERT INTO emi_plans (name, tenure_months, interest_rate, cashback, cashback_description, min_amount) VALUES ($1, $2, $3, $4, $5, $6)',
        [plan.name, plan.tenure_months, plan.interest_rate, plan.cashback, plan.cashback_description, plan.min_amount]
      );
    }

    console.log('Sample data inserted successfully');
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initDatabase();

