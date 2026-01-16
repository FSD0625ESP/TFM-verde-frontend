import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { createOrder } from "../services/api";
import { addToast } from "@heroui/react";

export default function PaymentPage() {
  const stored = localStorage.getItem("paymentData");
  const state = stored ? JSON.parse(stored) : null;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">No hay información del pedido</p>
      </div>
    );
  }

  const { cart, total, items, storeId, user, selectedAddressId } = state;

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1️⃣ crear orden
      const order = await createOrder({
        customerId: user._id,
        storeId,
        addressId: selectedAddressId,
        items,
      });

      console.log("Orden creada:", order);
      setOrderData(order);

      addToast({
        title: "Pago realizado",
        description: "Tu pago ha sido procesado correctamente.",
        color: "success",
      });

      setIsLoading(false);
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

  const handleContinue = () => {
    navigate("/confirmation", {
      state: {
        cart,
        total,
        customerName: `${user.firstName} ${user.lastName}`,
        orderId: orderData._id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Payment</h1>

        {orderData && (
          <div className="mb-8 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
            <p className="text-green-800 font-bold text-lg mb-4">
              ¡Pago realizado exitosamente!
            </p>
            <Button
              color="primary"
              className="bg-blue-600 text-white w-full"
              onClick={handleContinue}
              size="lg"
            >
              Continuar a confirmación
            </Button>
          </div>
        )}

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
                disabled={isLoading || orderData}
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
                        src={item.productId.images[0]}
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
