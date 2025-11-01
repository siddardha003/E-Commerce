'use client';

import { useState, useMemo } from 'react';
import { Product } from '../types/product';
import Link from 'next/link';
import Image from 'next/image';
import Header from './Header';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(product => product.category);
    return Array.from(new Set(cats));
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated collection of premium products crafted with care and attention to detail
          </p>
        </div>

      {/* Search and Filter Controls */}
      <div className="mb-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-12"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id?.toString()} className="card group cursor-pointer">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-orange-50 to-orange-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="h-56 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-56 w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-peach-100">
                  <span className="text-orange-300 text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${product.inventory > 10 ? 'status-good' : 'status-low'}`}>
                  {product.inventory} in stock
                </span>
              </div>
              <div className="mb-4">
                <span className="badge">
                  {product.category}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <AddToCartButton 
                  product={product} 
                  className="w-full py-3 px-4 rounded-xl text-sm font-medium"
                />
                
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="btn-secondary flex-1 text-center py-2 px-4 rounded-xl text-sm font-medium no-underline hover:no-underline"
                  >
                    View Details
                  </Link>
                  
                  <WishlistButton 
                    product={product}
                    compact={true}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto p-8">
            <svg className="mx-auto h-16 w-16 text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">
              No products found
            </p>
            <p className="text-gray-500 text-sm">
              Try adjusting your search criteria or browse all categories
            </p>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/70 backdrop-blur-sm border border-orange-100">
          <p className="text-gray-600 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>
      </div>
    </>
  );
}