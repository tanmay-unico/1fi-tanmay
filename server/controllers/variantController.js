const variantService = require('../services/variantService');
const emiService = require('../services/emiService');

const variantController = {
  async getEMIPlansForVariant(req, res) {
    try {
      const { variantId } = req.params;

      const variant = await variantService.getVariantById(variantId);

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      const emiPlans = await emiService.getEMIPlansForVariant(variant.price);

      res.json(emiPlans);
    } catch (error) {
      console.error('Error fetching EMI plans:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = variantController;

