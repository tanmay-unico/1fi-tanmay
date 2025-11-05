const productService = require('../services/productService');
const emiService = require('../services/emiService');

const productController = {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;

      const product = await productService.getProductBySlug(slug);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const variants = await productService.getVariantsByProductId(product.id);
      const emiPlans = await emiService.getAllEMIPlans();

      res.json({
        ...product,
        variants,
        emiPlans,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = productController;

