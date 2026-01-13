// src/pages/CartPage.jsx
import React from "react";
import { Button } from "@heroui/react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAlert } from "../contexts/AlertContext";
import AddToCartButton from "../components/Cart/AddToCartButton";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const { addAlert, addToast } = useAlert();

  const total = cart.reduce((acc, item) => {
    const product = item.productId;
    return acc + (product?.price || 0) * (item.quantity || 0);
  }, 0);


  return (
    <div className="text-gray-800 py-8 flex flex-col">
      {/* Container principal blanco con padding */}
      <div className="container mx-auto px-6 pb-6 bg-white rounded-md shadow-sm flex-grow flex flex-col">
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
                    className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 shadow-sm rounded-lg "
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images?.[0].url || "/placeholder.png"}
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
                        <AddToCartButton
                          productId={product._id}
                          quantity={1}
                          showQuantity={true}
                          buttonText="Agregar más"
                        />
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex gap-3">
                      <Button
                        color="danger"
                        onClick={() =>
                          addAlert({
                            title: "Eliminar producto",
                            message: `¿Estás seguro de que deseas eliminar "${product.title}" del carrito?`,
                            type: "danger",
                            confirmText: "Eliminar",
                            cancelText: "Cancelar",
                            onConfirm: () => {
                              removeFromCart(product._id);
                              addToast({
                                message: "Producto eliminado del carrito",
                                type: "success",
                                duration: 2000,
                              });
                            },
                          })
                        }
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
                <Button
                  color="secondary"
                  onClick={() =>
                    addAlert({
                      title: "Vaciar carrito",
                      message: "¿Deseas vaciar completamente tu carrito?",
                      type: "warning",
                      confirmText: "Vaciar",
                      cancelText: "Cancelar",
                      onConfirm: () => {
                        clearCart();
                        addToast({
                          message: "Carrito vaciado correctamente",
                          type: "success",
                          duration: 2000,
                        });
                      },
                    })
                  }
                >
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
