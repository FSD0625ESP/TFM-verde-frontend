// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

// Crear contexto
const CartContext = createContext();

// Proveedor del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Añadir producto al carrito
  const addToCart = (product) => {
    setCart((prevItems) => {
      // Revisar si el producto ya existe
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Si existe, aumentar cantidad
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        // Si no existe, añadir al carrito con quantity por defecto 1
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCart((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el carrito
export const useCart = () => useContext(CartContext);
