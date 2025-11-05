import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    // Get data from location state or localStorage
    const data = location.state || JSON.parse(localStorage.getItem('checkoutData') || 'null');
    
    if (!data || !data.variant || !data.plan || !data.product) {
      // If no data, show empty state
      return;
    }
    
    setCheckoutData(data);
  }, [location]);

  const calculateEMI = (principal, tenure, interestRate) => {
    const principalNum = parseFloat(principal) || 0;
    const tenureNum = parseInt(tenure) || 0;
    const interestRateNum = parseFloat(interestRate) || 0;

    if (tenureNum === 0) return 0;
    if (interestRateNum === 0) return principalNum / tenureNum;
    
    const monthlyRate = interestRateNum / 100 / 12;
    const emi = (principalNum * monthlyRate * Math.pow(1 + monthlyRate, tenureNum)) /
                (Math.pow(1 + monthlyRate, tenureNum) - 1);
    return emi;
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const { product, variant, plan } = checkoutData;
  const monthlyPayment = calculateEMI(variant.price, plan.tenure_months, plan.interest_rate);
  const totalAmount = monthlyPayment * plan.tenure_months;
  const savings = variant.mrp - variant.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Summary</h1>
          <p className="text-gray-600">Your selected product and EMI plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Product & Plan Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-1">Product Details</h2>
                <p className="text-blue-100">Your selected product</p>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={variant.image_url || 'https://via.placeholder.com/300x300'}
                      alt={product.name}
                      className="w-full md:w-64 h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Variant:</span>
                        <span className="font-semibold text-gray-900">{variant.name}</span>
                      </div>
                      {variant.color && (
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Color:</span>
                          <span className="font-semibold text-gray-900">{variant.color}</span>
                        </div>
                      )}
                      {variant.storage && (
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Storage:</span>
                          <span className="font-semibold text-gray-900">{variant.storage}</span>
                        </div>
                      )}
                      <div className="flex items-center pt-2 border-t">
                        <span className="text-gray-500 w-24">Price:</span>
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{parseFloat(variant.price).toLocaleString('en-IN')}
                          </span>
                          {variant.mrp !== variant.price && (
                            <span className="text-lg text-gray-500 line-through ml-3">
                              ₹{parseFloat(variant.mrp).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="flex items-center">
                          <span className="text-green-600 font-semibold">
                            You save ₹{savings.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EMI Plan Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-1">EMI Plan Details</h2>
                <p className="text-green-100">Your selected payment plan</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-gray-600">Payment Plan</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Tenure</div>
                      <div className="text-2xl font-bold text-green-600">{plan.tenure_months} months</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
                      <div className="text-xl font-bold text-gray-900">
                        {parseFloat(plan.interest_rate) === 0 ? '0%' : `${plan.interest_rate}%`}
                      </div>
                    </div>
                    {plan.cashback > 0 && (
                      <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <div className="text-sm text-green-700 mb-1">Cashback</div>
                        <div className="text-xl font-bold text-green-700">
                          ₹{parseFloat(plan.cashback).toLocaleString('en-IN')}
                        </div>
                      </div>
                    )}
                  </div>

                  {plan.cashback_description && (
                    <div className="p-4 bg-green-100 rounded-xl border border-green-300">
                      <p className="text-green-800 font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {plan.cashback_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-1">Payment Summary</h2>
                <p className="text-purple-100">Your order breakdown</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Monthly Payment Highlight */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="text-sm text-gray-600 mb-2">Monthly Payment</div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    ₹{isNaN(monthlyPayment) ? '0' : monthlyPayment.toFixed(0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500">for {plan.tenure_months} months</div>
                </div>

                {/* Breakdown */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between text-gray-700">
                    <span>Product Price</span>
                    <span className="font-semibold">₹{parseFloat(variant.price).toLocaleString('en-IN')}</span>
                  </div>
                  
                  {parseFloat(plan.interest_rate) > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Interest Amount</span>
                      <span className="font-semibold">
                        ₹{(totalAmount - parseFloat(variant.price)).toFixed(0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Total Amount</span>
                    <span className="font-semibold">
                      ₹{isNaN(totalAmount) ? '0' : totalAmount.toFixed(0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600 pt-2 border-t">
                      <span className="font-semibold">You Save</span>
                      <span className="font-bold">₹{savings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {plan.cashback > 0 && (
                    <div className="flex justify-between text-green-600 pt-2 border-t">
                      <span className="font-semibold">Cashback</span>
                      <span className="font-bold">₹{parseFloat(plan.cashback).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>


                {/* Trust Badges */}
                <div className="pt-6 border-t">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      EMI Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

