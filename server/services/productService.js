const pool = require('../config/database');

const productService = {
  async getAllProducts() {
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
    return result.rows;
  },

  async getProductBySlug(slug) {
    const productResult = await pool.query(
      'SELECT * FROM products WHERE slug = $1',
      [slug]
    );

    if (productResult.rows.length === 0) {
      return null;
    }

    return productResult.rows[0];
  },

  async getVariantsByProductId(productId) {
    const variantsResult = await pool.query(
      'SELECT * FROM variants WHERE product_id = $1 ORDER BY price',
      [productId]
    );
    return variantsResult.rows;
  },
};

module.exports = productService;

