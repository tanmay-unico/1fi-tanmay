const pool = require('../config/database');
const { calculateEMI } = require('../utils/emiCalculator');

const emiService = {
  async getAllEMIPlans() {
    const emiPlansResult = await pool.query(
      'SELECT * FROM emi_plans ORDER BY tenure_months, interest_rate'
    );
    return emiPlansResult.rows;
  },

  async getEMIPlansForVariant(variantPrice) {
    const emiPlans = await this.getAllEMIPlans();

    return emiPlans.map(plan => {
      const monthlyPayment = calculateEMI(variantPrice, plan.tenure_months, plan.interest_rate);
      return {
        ...plan,
        monthlyPayment: monthlyPayment.toFixed(2),
        principal: variantPrice,
      };
    });
  },
};

module.exports = emiService;

