import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/api";
import { Spinner } from "@heroui/react";

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError("No se proporcionó un ID de orden");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err.response?.data?.error ||
            "No se pudo cargar la información del pedido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <a
            href="http://localhost:5173/"
            className="bg-[#26A69A] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2bb39a] transition"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pedido no encontrado
          </h2>
          <p className="text-gray-700 mb-6">
            No se pudo encontrar la información del pedido.
          </p>
          <a
            href="http://localhost:5173/"
            className="bg-[#26A69A] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2bb39a] transition"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 2.0;
  const taxes = 5.0;
  const total = subtotal + shipping + taxes;

  // Get address information
  const address = order.addressId;
  const customerName = `${order.customerId?.firstName || ""} ${
    order.customerId?.lastName || ""
  }`.trim();

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
              {address && (
                <>
                  <p>
                    <span className="font-semibold">Dirección:</span>{" "}
                    {address.street}
                  </p>
                  <p>
                    <span className="font-semibold">Ciudad:</span> {address.city}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span> {address.state}
                  </p>
                  <p>
                    <span className="font-semibold">Código postal:</span>{" "}
                    {address.postalCode}
                  </p>
                  <p>
                    <span className="font-semibold">País:</span>{" "}
                    {address.country || "España"}
                  </p>
                  {address.phone && (
                    <p>
                      <span className="font-semibold">Teléfono:</span>{" "}
                      {address.phone}
                    </p>
                  )}
                </>
              )}
              {order.customerId?.email && (
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {order.customerId.email}
                </p>
              )}
              <p>
                <span className="font-semibold">Nº de Orden:</span> {order._id}
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
            {order.items.map((item) => {
              const product = item.productId;
              if (!product) return null;

              const title = product.title || "Producto sin nombre";
              const price = item.price || 0;
              const images = product.images || [];
              const itemKey = item._id || product._id || Math.random();

              return (
                <div
                  key={itemKey}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center gap-4 text-left">
                    <img
                      src={
                        images && images.length > 0
                          ? images[0].url
                          : "/placeholder.png"
                      }
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total del Pedido</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
