export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_BY_SLUG: (slug) => `/api/products/${slug}`,
  VARIANT_EMI_PLANS: (variantId) => `/api/variants/${variantId}/emi-plans`,
};

