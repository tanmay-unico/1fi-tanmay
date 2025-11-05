import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Product detail component
function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedEMIPlan, setSelectedEMIPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const calculateEMI = (principal, tenure, interestRate) => {
    // Convert to numbers to handle string values from database
    const principalNum = parseFloat(principal) || 0;
    const tenureNum = parseInt(tenure) || 0;
    const interestRateNum = parseFloat(interestRate) || 0;

    if (tenureNum === 0) {
      return 0;
    }

    if (interestRateNum === 0) {
      return principalNum / tenureNum;
    }
    const monthlyRate = interestRateNum / 100 / 12;
    const emi = (principalNum * monthlyRate * Math.pow(1 + monthlyRate, tenureNum)) /
                (Math.pow(1 + monthlyRate, tenureNum) - 1);
    return emi;
  };

  const handleProceed = () => {
    if (!selectedVariant || !selectedEMIPlan) {
      alert('Please select a variant and an EMI plan');
      return;
    }
    // Store checkout data and navigate to checkout page
    const checkoutData = {
      product,
      variant: selectedVariant,
      plan: selectedEMIPlan,
    };
    // Store in localStorage as backup
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    // Navigate with state
    navigate('/checkout', { state: checkoutData });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">Error: {error || 'Product not found'}</div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <img
            src={selectedVariant?.image_url || 'https://via.placeholder.com/500x500'}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Variant Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Select Variant</h2>
            <div className="space-y-2">
              {product.variants?.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                    selectedVariant?.id === variant.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{variant.name}</div>
                      {variant.color && (
                        <div className="text-sm text-gray-600">Color: {variant.color}</div>
                      )}
                      {variant.storage && (
                        <div className="text-sm text-gray-600">Storage: {variant.storage}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ₹{variant.price?.toLocaleString('en-IN')}
                      </div>
                      {variant.mrp !== variant.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{variant.mrp?.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          {selectedVariant && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{selectedVariant.price?.toLocaleString('en-IN')}
                </span>
              </div>
              {selectedVariant.mrp !== selectedVariant.price && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">MRP:</span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{selectedVariant.mrp?.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* EMI Plans */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Available EMI Plans</h2>
            <div className="space-y-3">
              {product.emiPlans?.map((plan) => {
                const monthlyPayment = selectedVariant
                  ? calculateEMI(selectedVariant.price, plan.tenure_months, plan.interest_rate)
                  : 0;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedEMIPlan(plan)}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                      selectedEMIPlan?.id === plan.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{plan.name}</div>
                        <div className="text-sm text-gray-600">
                          Tenure: {plan.tenure_months} months
                        </div>
                        <div className="text-sm text-gray-600">
                          Interest Rate: {plan.interest_rate}%
                        </div>
                        {plan.cashback > 0 && plan.cashback_description && (
                          <div className="text-sm text-green-600 font-medium mt-1">
                            {plan.cashback_description}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        {selectedVariant && (
                          <div className="text-xl font-bold text-gray-900">
                            ₹{isNaN(monthlyPayment) ? '0' : monthlyPayment.toFixed(0).toLocaleString('en-IN')}/month
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!selectedVariant || !selectedEMIPlan}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              selectedVariant && selectedEMIPlan
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Proceed with Selected Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

