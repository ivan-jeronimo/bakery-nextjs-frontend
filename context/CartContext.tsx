"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definimos la estructura de un ítem en el carrito
export interface CartItem {
  productId: number;
  productName: string;
  sizeId: number;
  sizeName: string;
  weight?: string; // Nuevo campo para el peso (ej: "82g")
  designId?: number;
  designName?: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, sizeId: number, designId?: number) => void;
  clearCart: () => void;
  cartCount: number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('panaderia_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panaderia_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.sizeId === newItem.sizeId && 
          item.designId === newItem.designId
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: number, sizeId: number, designId?: number) => {
    setCart((prevCart) => 
      prevCart.filter(item => 
        !(item.productId === productId && item.sizeId === sizeId && item.designId === designId)
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
