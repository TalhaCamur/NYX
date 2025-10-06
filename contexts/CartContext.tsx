import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  getCartTotalQuantity: () => number;
  getCartTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage key
const CART_STORAGE_KEY = 'nyx-cart-items';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, 5) } // Cap quantity at 5
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateItemQuantity = (productId: string, quantity: number) => {
      setCartItems(prevItems =>
          prevItems.map(item =>
              item.id === productId
                  ? { ...item, quantity: Math.max(0, Math.min(quantity, 5)) } // Clamp between 0 and 5
                  : item
          ).filter(item => item.quantity > 0) // Remove if quantity is 0
      );
  };
  
  const getCartTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotalPrice = () => {
      return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, addToCart, removeFromCart, updateItemQuantity, getCartTotalQuantity, getCartTotalPrice, openCart, closeCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};