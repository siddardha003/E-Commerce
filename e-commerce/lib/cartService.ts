import { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class CartService {
  private static CART_KEY = 'cart';

  static getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  static addToCart(product: Product, quantity: number = 1): void {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(item => item.product._id === product._id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    this.notifyCartUpdate();
  }

  static removeFromCart(productId: string): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.product._id !== productId);
    localStorage.setItem(this.CART_KEY, JSON.stringify(updatedCart));
    this.notifyCartUpdate();
  }

  static updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.product._id === productId);
    
    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity;
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      this.notifyCartUpdate();
    }
  }

  static clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    this.notifyCartUpdate();
  }

  static getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  static getCartItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  private static notifyCartUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  }
}