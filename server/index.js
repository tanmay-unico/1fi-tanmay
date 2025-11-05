const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'emi_products',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully');
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.category,
        p.brand,
        MIN(v.mrp) as min_mrp,
        MIN(v.price) as min_price,
        MAX(v.mrp) as max_mrp,
        MAX(v.price) as max_price,
        (SELECT image_url FROM variants WHERE product_id = p.id LIMIT 1) as image_url
      FROM products p
      LEFT JOIN variants v ON p.id = v.product_id
      GROUP BY p.id, p.name, p.slug, p.description, p.category, p.brand
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const productResult = await pool.query(
      'SELECT * FROM products WHERE slug = $1',
      [slug]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    const variantsResult = await pool.query(
      'SELECT * FROM variants WHERE product_id = $1 ORDER BY price',
      [product.id]
    );

    const emiPlansResult = await pool.query(
      'SELECT * FROM emi_plans ORDER BY tenure_months, interest_rate'
    );

    res.json({
      ...product,
      variants: variantsResult.rows,
      emiPlans: emiPlansResult.rows,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/variants/:variantId/emi-plans', async (req, res) => {
  try {
    const { variantId } = req.params;
    
    const variantResult = await pool.query(
      'SELECT price FROM variants WHERE id = $1',
      [variantId]
    );

    if (variantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    const price = variantResult.rows[0].price;

    const emiPlansResult = await pool.query(
      'SELECT * FROM emi_plans ORDER BY tenure_months, interest_rate'
    );

    const emiPlans = emiPlansResult.rows.map(plan => {
      const monthlyPayment = calculateEMI(price, plan.tenure_months, plan.interest_rate);
      return {
        ...plan,
        monthlyPayment: monthlyPayment.toFixed(2),
        principal: price,
      };
    });

    res.json(emiPlans);
  } catch (error) {
    console.error('Error fetching EMI plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateEMI(principal, tenure, interestRate) {
  if (interestRate === 0) {
    return principal / tenure;
  }
  const monthlyRate = interestRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

