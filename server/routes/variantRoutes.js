const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');

router.get('/:variantId/emi-plans', variantController.getEMIPlansForVariant);

module.exports = router;

