'use client';

import { useState } from 'react';
import { Product } from '../types/product';

interface WishlistButtonProps {
  product: Product;
  compact?: boolean;
}

export default function WishlistButton({ product, compact = false }: WishlistButtonProps) {
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
    
    // Notify wishlist update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
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
      className={`flex items-center justify-center font-medium transition-all duration-300 ${
        compact 
          ? `w-12 h-10 rounded-xl ${isInWishlist ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 hover:from-orange-200 hover:to-orange-300 border border-orange-200'}`
          : `w-full py-3 px-4 rounded-xl ${isInWishlist ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg hover:shadow-xl hover:from-red-500 hover:to-red-600' : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 hover:from-orange-200 hover:to-orange-300 border border-orange-200'}`
      } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:transform hover:scale-[1.02]'}`}
      title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <svg
        className={`${compact ? 'w-4 h-4' : 'w-4 h-4 mr-2'} ${isInWishlist ? 'fill-current' : 'stroke-current fill-none'}`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {!compact && (
        <span>
          {isLoading ? 'Loading...' : isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}