import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS);
  }

  async getProductBySlug(slug) {
    return this.request(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
  }

  async getEMIPlansForVariant(variantId) {
    return this.request(API_ENDPOINTS.VARIANT_EMI_PLANS(variantId));
  }
}

export default new ApiService();

