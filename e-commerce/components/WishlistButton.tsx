'use client';

import { useState } from 'react';
import { Product } from '../types/product';

interface WishlistButtonProps {
  product: Product;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleWishlist = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = product._id?.toString();
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = currentWishlist.filter((id: string) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      if (productId && !currentWishlist.includes(productId)) {
        const updatedWishlist = [...currentWishlist, productId];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }
      setIsInWishlist(true);
    }
    
    setIsLoading(false);
  };

  // Check if product is in wishlist on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const productId = product._id?.toString();
      setIsInWishlist(currentWishlist.includes(productId));
    }
  });

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`flex items-center justify-center w-full py-2 px-4 rounded-md font-medium transition-colors ${
        isInWishlist
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current' : 'stroke-current fill-none'}`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isLoading ? 'Loading...' : isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </button>
  );
}