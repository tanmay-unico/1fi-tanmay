const pool = require('../config/database');

const variantService = {
  async getVariantById(variantId) {
    const variantResult = await pool.query(
      'SELECT price FROM variants WHERE id = $1',
      [variantId]
    );

    if (variantResult.rows.length === 0) {
      return null;
    }

    return variantResult.rows[0];
  },
};

module.exports = variantService;

