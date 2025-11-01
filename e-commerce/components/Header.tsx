'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import { CartService } from '../lib/cartService';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Close other sidebar when opening one
  const openCart = () => {
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  const openWishlist = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(true);
  };

  const closeAllSidebars = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
  };

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isCartOpen || isWishlistOpen) {
      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isCartOpen, isWishlistOpen]);

  // Update counts from localStorage
  useEffect(() => {
    const updateCounts = () => {
      if (typeof window !== 'undefined') {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setCartCount(CartService.getCartItemCount());
        setWishlistCount(wishlist.length);
      }
    };

    updateCounts();

    // Listen for storage changes
    window.addEventListener('storage', updateCounts);
    
    // Custom event listener for cart/wishlist updates
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Elegant Store
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/recommendations" className="nav-link">
              Recommendations
            </Link>
            <Link href="/admin" className="nav-link">
              Admin
            </Link>
          </nav>

          {/* Cart & Wishlist */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Button */}
            <button 
              onClick={openWishlist}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H20" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebars */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={closeAllSidebars} 
      />
      <WishlistSidebar 
        isOpen={isWishlistOpen} 
        onClose={closeAllSidebars} 
      />
    </header>
  );
}