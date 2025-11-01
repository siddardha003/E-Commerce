'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CartService, CartItem } from '../lib/cartService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCartItems(CartService.getCart());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(CartService.getCart());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    setIsLoading(true);
    CartService.updateQuantity(productId, quantity);
    setCartItems(CartService.getCart());
    setIsLoading(false);
  };

  const removeItem = (productId: string) => {
    setIsLoading(true);
    CartService.removeFromCart(productId);
    setCartItems(CartService.getCart());
    setIsLoading(false);
  };

  const total = CartService.getCartTotal();
  const itemCount = CartService.getCartItemCount();

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
        <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-peach-50">
          <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-orange-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H20" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id?.toString()} className="card p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product._id!.toString(), item.quantity - 1)}
                          disabled={isLoading}
                          className="w-8 h-8 rounded-lg border border-orange-200 flex items-center justify-center hover:bg-orange-50 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="px-3 py-1 bg-orange-50 rounded-lg text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.product._id!.toString(), item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.product.inventory}
                          className="w-8 h-8 rounded-lg border border-orange-200 flex items-center justify-center hover:bg-orange-50 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => removeItem(item.product._id!.toString())}
                          disabled={isLoading}
                          className="ml-auto p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
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
        {cartItems.length > 0 && (
          <div className="border-t border-orange-100 p-6 bg-gradient-to-r from-orange-50 to-peach-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">Total ({itemCount} items)</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <button className="btn-primary w-full py-3">
              Proceed to Checkout
            </button>
            
            <button 
              onClick={onClose}
              className="btn-secondary w-full py-2 mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}