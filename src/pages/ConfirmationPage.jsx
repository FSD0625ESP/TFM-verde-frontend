import React from "react";
import { useLocation } from "react-router-dom";

export default function ConfirmationPage() {
  const location = useLocation();
  const {
    cart = [],
    total = 0,
    customerName = "",
    customer = {},
    orderId,
  } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white shadow-md rounded-lg max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Columna izquierda */}
        <div className="p-10 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl font-bold">¡Gracias por tu compra!</h1>

          <p className="text-gray-600 max-w-sm">
            Tu pedido ha sido recibido y será procesado dentro de las próximas
            24 horas. Te notificaremos por correo cuando haya sido enviado.
          </p>

          <div className="w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Dirección de facturación</h3>
            <div className="grid gap-2 text-sm text-left">
              <p>
                <span className="font-semibold">Nombre:</span> {customerName}
              </p>
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {customer.address}
              </p>
              <p>
                <span className="font-semibold">Ciudad:</span> {customer.city}
              </p>
              <p>
                <span className="font-semibold">Estado:</span> {customer.state}
              </p>
              <p>
                <span className="font-semibold">Código postal:</span>{" "}
                {customer.postalCode}
              </p>
              <p>
                <span className="font-semibold">País:</span> {customer.country}
              </p>
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                {customer.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {customer.email}
              </p>
              <p>
                <span className="font-semibold">Nº de Orden:</span> {orderId}
              </p>
            </div>
          </div>

          <a
            href="http://localhost:5173/"
            className="bg-[#26A69A] text-white px-8 py-4 text-xl rounded-full font-semibold hover:bg-[#2bb39a] transition"
          >
            Volver al inicio
          </a>
        </div>

        {/* Columna derecha */}
        <div className="bg-gray-50 p-10 flex flex-col items-center text-center gap-6">
          <h2 className="text-2xl font-bold">Resumen del pedido</h2>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            {cart.map((item) => {
              // Manejar ambos formatos: item.product o item.productId
              const product = item.product || item.productId;
              if (!product) return null;

              const title = product.title || "Producto sin nombre";
              const price = product.price || 0;
              const images = product.images || [];
              const itemKey = item._id || product._id || Math.random();

              return (
                <div
                  key={itemKey}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center gap-4 text-left">
                    <img
                      src={images[0] || "/placeholder.png"}
                      alt={title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-gray-600 text-sm">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${(price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 text-sm text-gray-700 flex flex-col gap-2 w-full max-w-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>$2.00</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total del Pedido</span>
              <span>${(total + 2 + 5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
