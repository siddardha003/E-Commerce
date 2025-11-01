'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import { CartService } from '../lib/cartService';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadWishlistItems();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (isOpen) {
        loadWishlistItems();
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [isOpen]);

  const loadWishlistItems = async () => {
    if (typeof window === 'undefined') return;
    
    setIsLoading(true);
    try {
      const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      // In a real app, you'd fetch these from your API
      // For now, we'll get them from localStorage products or API
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success && data.data) {
        const allProducts = data.data;
        const wishlistProducts = allProducts.filter((product: Product) => 
          wishlistIds.includes(product._id?.toString())
        );
        setWishlistItems(wishlistProducts);
      }
    } catch (error) {
      console.error('Error loading wishlist items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = currentWishlist.filter((id: string) => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Update local state
    setWishlistItems(prev => prev.filter(item => item._id?.toString() !== productId));
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const addToCart = (product: Product) => {
    CartService.addToCart(product, 1);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-gradient-to-r from-red-50 to-pink-50">
          <h2 className="text-xl font-bold text-gray-800">Wishlist</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 mx-auto mb-4 border-2 border-orange-300 border-t-orange-600 rounded-full"></div>
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600">Save items you love for later!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item._id?.toString()} className="card p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-red-50 to-pink-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                      <p className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.inventory > 0 ? `${item.inventory} in stock` : 'Out of stock'}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => addToCart(item)}
                          disabled={item.inventory === 0}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                            item.inventory > 0
                              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Add to Cart
                        </button>
                        
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="px-3 py-1 text-xs rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        
                        <button
                          onClick={() => removeFromWishlist(item._id!.toString())}
                          className="ml-auto p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-orange-100 p-6 bg-gradient-to-r from-red-50 to-pink-50">
            <div className="text-center mb-4">
              <span className="text-lg font-medium text-gray-800">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </span>
            </div>
            
            <button 
              onClick={onClose}
              className="btn-secondary w-full py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}