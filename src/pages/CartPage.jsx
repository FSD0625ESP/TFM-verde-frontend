// src/pages/CartPage.jsx
import React from "react";
import { Button } from "@heroui/react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((acc, item) => {
    const product = item.productId;
    return acc + (product?.price || 0) * (item.quantity || 0);
  }, 0);

  return (
    <div className="min-h-[60vh] bg-gray-100 text-gray-800 py-8 flex flex-col">
      {/* Container principal blanco con padding */}
      <div className="max-w-5xl mx-auto px-6 bg-white rounded-md shadow-sm flex-grow flex flex-col">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold mb-2">Tu carrito</h1>
          <p className="text-lg text-gray-700">
            Revisa los productos antes de pagar
          </p>
        </header>

        {cart.length === 0 ? (
          // Contenedor centrado verticalmente y horizontalmente
          <section className="flex-grow flex justify-center items-center">
            <div className="max-w-md text-center px-4">
              <ShoppingCart className="mx-auto mb-4 text-[#26A69A]" size={48} />

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Tu carrito está vacío
              </h2>

              <p className="text-gray-600 mb-6">
                ¡Parece que aún no has agregado productos!
              </p>

              <Button
                color="success"
                className="bg-[#26A69A] text-white"
                onClick={() => navigate("/stores")}
              >
                Seguir comprando
              </Button>
            </div>
          </section>
        ) : (
          <section>
            <div className="flex flex-col gap-6">
              {cart.map((item) => {
                const product = item.productId;
                if (!product) return null; // evita errores si populate falla

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 shadow-sm rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h2 className="text-xl font-semibold">
                          {product.title}
                        </h2>
                        <p className="text-gray-600">
                          ${(product.price || 0).toFixed(2)}
                        </p>
                        <p className="text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex gap-3">
                      <Button
                        color="danger"
                        onClick={() => removeFromCart(product._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-2xl font-semibold">
                Total: ${total.toFixed(2)}
              </p>
              <div className="flex gap-4 pb-4">
                <Button color="secondary" onClick={clearCart}>
                  Vaciar carrito
                </Button>
                <Button color="success" onClick={() => navigate("/checkout")}>
                  Pagar
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
