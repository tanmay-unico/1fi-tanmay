import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { calculateEMI } from '../utils/emiCalculator';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedEMIPlan, setSelectedEMIPlan] = useState(null);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const handleProceed = () => {
    if (!selectedVariant || !selectedEMIPlan) {
      alert('Please select a variant and an EMI plan');
      return;
    }
    const checkoutData = {
      product,
      variant: selectedVariant,
      plan: selectedEMIPlan,
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
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
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <img
              src={selectedVariant?.image_url || 'https://via.placeholder.com/500x500'}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Variants</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {product.variants?.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3 border-2 rounded-lg transition-all text-center bg-white hover:bg-gray-50 ${
                    selectedVariant?.id === variant.id
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="mb-2.5 relative">
                    <img
                      src={variant.image_url || 'https://via.placeholder.com/150x150'}
                      alt={variant.name}
                      className={`w-full h-24 sm:h-28 object-contain rounded-md transition-transform ${
                        selectedVariant?.id === variant.id ? 'scale-110' : 'hover:scale-105'
                      }`}
                    />
                    {selectedVariant?.id === variant.id && (
                      <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2rem]">
                    {variant.name}
                  </div>
                  {variant.color && (
                    <div className="text-xs text-gray-600 mb-0.5 font-medium">{variant.color}</div>
                  )}
                  {variant.storage && (
                    <div className="text-xs text-gray-500 mb-1.5 font-medium">{variant.storage}</div>
                  )}
                  <div className="text-xs font-bold text-blue-600 mb-0.5">
                    ₹{parseFloat(variant.price).toLocaleString('en-IN')}
                  </div>
                  {variant.mrp !== variant.price && (
                    <div className="text-xs text-gray-400 line-through">
                      ₹{parseFloat(variant.mrp).toLocaleString('en-IN')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

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

