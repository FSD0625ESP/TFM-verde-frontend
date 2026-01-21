import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { addToast } from "@heroui/react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Get data from location state instead of localStorage
  const { orderId, cart, total, user } = location.state || {};

  if (!orderId || !cart || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">No hay información del pedido</p>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast({
        title: "Pago realizado",
        description: "Tu pago ha sido procesado correctamente.",
        color: "success",
      });

      setIsLoading(false);

      // Navigate to confirmation with order ID in URL
      navigate(`/confirmation/${orderId}`);
    } catch (err) {
      console.error(err);

      addToast({
        title: "Error",
        description: "Hubo un problema al procesar el pago",
        color: "danger",
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Datos de tarjeta */}
          <Card>
            <CardBody className="gap-4">
              <h2 className="text-xl font-bold">Payment Method</h2>

              <Input label="Card Number" placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiration" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
              </div>

              <Button
                color="success"
                className="bg-green-600 text-white"
                onClick={handlePayment}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </CardBody>
          </Card>

          {/* Resumen del pedido */}
          <Card>
            <CardBody className="gap-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {cart.map((item) => (
                <div key={item.productId._id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    {item.productId.images &&
                      item.productId.images.length > 0 ? (
                      <img
                        src={item.productId.images ? item.productId.images[0].url : "/placeholder.png"}
                        alt={item.productId.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">
                          Sin imagen
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.productId.title}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold">
                      ${(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
