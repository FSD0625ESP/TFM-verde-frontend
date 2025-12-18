import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { createOrder } from "../services/api";
import { addToast } from "@heroui/react";

export default function PaymentPage() {
  const stored = localStorage.getItem("paymentData");
  const state = stored ? JSON.parse(stored) : null;
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">No hay información del pedido</p>
      </div>
    );
  }

  const { cart, total, items, storeId, user, selectedAddressId } = state;

  const handlePayment = async () => {
    try {
      // simular un pequeño delay
      await new Promise((res) => setTimeout(res, 1500));

      // 1️⃣ crear orden realmente ahora
      const orderData = await createOrder({
        customerId: user._id,
        storeId,
        addressId: selectedAddressId,
        items,
      });

      addToast({
        title: "Pago realizado",
        description: "Tu pago ha sido procesado correctamente.",
        color: "success",
      });

      navigate("/confirmation", {
        state: {
          cart,
          total,
          customerName: `${user.firstName} ${user.lastName}`,
          orderId: orderData._id,
        },
      });
    } catch (err) {
      console.error(err);

      addToast({
        title: "Error",
        description: "Hubo un problema al procesar el pago",
        color: "danger",
      });
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
              >
                Pay ${total.toFixed(2)}
              </Button>
            </CardBody>
          </Card>

          {/* Resumen del pedido */}
          <Card>
            <CardBody className="gap-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {cart.map((item) => (
                <div key={item.productId._id} className="flex justify-between">
                  <span>
                    {item.productId.title} x {item.quantity}
                  </span>
                  <span>
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </span>
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
