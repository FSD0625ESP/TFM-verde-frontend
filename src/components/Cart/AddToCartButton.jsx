import React, { useState } from "react";
import { Input } from "@heroui/react";
import { ShoppingCart } from "lucide-react"
import { useCart } from "../../contexts/CartContext";

export default function AddToCartButton({ productId, quantity = 1, showQuantity = true, buttonText, onClick }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantityState, setQuantityState] = useState(quantity);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
    if (!productId) return;
    setLoading(true);
    try {
      // ✅ PASAMOS UN OBJETO
      await addToCart({ productId, quantity: quantityState });
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {showQuantity ? (<Input type="number" min={1} value={quantityState} color="primary" onChange={(e) => setQuantityState(Number(e.target.value))} className="w-15 text-white" />
      ) : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Añadir al carrito"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : null}
        {buttonText || "Comprar"}
      </button>
    </div>
  );
}
