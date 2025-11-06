import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      if (product.category) {
        unique.add(product.category);
      }
    });
    return Array.from(unique);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(
      (product) => product.category && product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  const getDiscountPercentage = (product) => {
    if (!product.min_mrp || !product.min_price) {
      return null;
    }
    const discount = product.min_mrp - product.min_price;
    if (discount <= 0) {
      return null;
    }
    return Math.round((discount / product.min_mrp) * 100);
  };

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-60 bg-slate-200" />
          <div className="space-y-4 p-6">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded bg-slate-200" />
              <div className="h-6 w-16 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderLoadingSkeletons()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Products
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Explore curated gadgets, appliances, and lifestyle picks with flexible EMI options tailored to your budget.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-gray-400">
              Total products
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {filteredProducts.length}
            </span>
          </div>
          <div className="hidden h-10 w-px bg-gray-200 sm:block" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-gray-400">
              Financing
            </span>
            <span className="text-lg font-semibold text-gray-900">
              Flexible EMI plans
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Explore our latest arrivals
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Filter by category or dive into deals designed for easy monthly payments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-300/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/30'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <h4 className="text-xl font-semibold text-gray-900">
            No products in this category yet
          </h4>
          <p className="mt-2 text-sm text-gray-500">
            Try selecting another filter or check back soon for fresh arrivals.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const discount = getDiscountPercentage(product);
            return (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
          >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/400x300'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {discount && (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
                      Save {discount}%
                    </div>
                  )}
                  {product.brand && (
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      {product.brand}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        {product.category || 'General'}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        Flexible EMI
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <p className="mt-2 min-h-[56px] text-sm leading-relaxed text-gray-600">
                      {product.description || 'Experience high-performance with EMI plans tailored to your lifestyle.'}
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{product.min_price?.toLocaleString('en-IN')}
                      </span>
                      {product.min_mrp !== product.min_price && (
                        <span className="text-sm font-medium text-gray-400 line-through">
                          ₹{product.min_mrp?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-500">
                      Zero hidden charges · Instant approval
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12l-7.5 7.5M3 12h18"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
          </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductList;

