'use client';

import { useState } from 'react';
import { Product } from '../types/product';
import { CartService } from '../lib/cartService';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    if (product.inventory === 0) return;

    setIsAdding(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    CartService.addToCart(product, 1);
    setJustAdded(true);
    setIsAdding(false);

    // Reset the "just added" state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000);
  };

  const isOutOfStock = product.inventory === 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isOutOfStock}
      className={`flex items-center justify-center transition-all duration-300 ${
        isOutOfStock
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : justAdded
          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
          : 'btn-primary hover:transform hover:scale-[1.02]'
      } ${isAdding ? 'opacity-70' : ''} ${className}`}
    >
      <svg 
        className={`w-4 h-4 mr-2 transition-transform ${isAdding ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {justAdded ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : isAdding ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H20" />
        )}
      </svg>
      {isOutOfStock 
        ? 'Out of Stock' 
        : justAdded 
        ? 'Added!' 
        : isAdding 
        ? 'Adding...' 
        : 'Add to Cart'
      }
    </button>
  );
}