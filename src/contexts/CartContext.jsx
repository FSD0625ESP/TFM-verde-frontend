// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  replaceAnonymousCart as apiReplaceAnonymousCart,
} from "../services/api";
import { addToast } from "@heroui/react";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [isReplacingCart, setIsReplacingCart] = useState(false);

  // 1️⃣ Cargar carrito al iniciar o cuando el usuario cambie
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await apiGetCart();
        setCart(data.items || []);
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };

    loadCart();
  }, [user]);

  // 2️⃣ Añadir producto al carrito
  const addToCart = async ({ productId, quantity = 1 }) => {
    try {
      if (!productId) throw new Error("productId es obligatorio");
      const data = await apiAddToCart({ productId, quantity });
      setCart(data.items || []);
      addToast({
        title: "Añadido al carrito",
        description: "Producto añadido correctamente",
        color: "success",
        duration: 3000,
      });
      return data;
    } catch (err) {
      console.error("Error al añadir al carrito:", err);
      addToast({
        title: "Error",
        description:
          err.response?.data?.message || "No se pudo añadir al carrito",
        color: "danger",
        duration: 4000,
      });
      throw err;
    }
  };

  // 3️⃣ Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    console.log("🛒 Eliminando producto del carrito:", productId);
    try {
      const data = await apiRemoveFromCart({ productId });
      setCart(data.items || []);
      addToast({
        title: "Eliminado",
        description: "Producto eliminado del carrito",
        color: "success",
        duration: 2500,
      });
    } catch (err) {
      console.error("Error al eliminar del carrito:", err);
      addToast({
        title: "Error",
        description:
          err.response?.data?.msg || "No se pudo eliminar el producto",
        color: "danger",
        duration: 4000,
      });
    }
  };

  // 4️⃣ Vaciar carrito
  const clearCart = async () => {
    try {
      await apiClearCart();
      setCart([]);
      addToast({
        title: "Carrito vaciado",
        description: "Se han eliminado todos los productos del carrito",
        color: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Error al vaciar carrito:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.msg || "No se pudo vaciar el carrito",
        color: "danger",
        duration: 4000,
      });
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, isReplacingCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
