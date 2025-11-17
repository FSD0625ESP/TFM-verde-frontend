// src/pages/FullCartPage.jsx
import React from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { Button } from "@heroui/react";

export default function FullCartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  // Calcular el total del carrito
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center items-center bg-[#f6fffd] text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">
          Tu carrito está vacío 🛒
        </h2>
        <p className="text-lg">
          Agrega productos para continuar con la compra.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f6fffd] text-gray-800 py-12 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#26A69A]">Tu carrito</h1>

      <div className="flex flex-col gap-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 shadow-sm rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <p className="text-gray-500">Cantidad: {item.quantity}</p>
              </div>
            </div>

            <Button
              color="danger"
              className="mt-4 sm:mt-0"
              onClick={() => removeFromCart(item.id)}
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-2xl font-semibold">Total: ${total.toFixed(2)}</p>
        <div className="flex gap-4">
          <Button color="secondary" onClick={clearCart}>
            Vaciar carrito
          </Button>
          <Button color="success">Pagar</Button>
        </div>
      </div>
    </div>
  );
}
