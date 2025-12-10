// src/pages/CheckOutPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { addToast, Button, Card, CardBody } from "@heroui/react";
import { createOrder } from "../services/api";
import AddressSelector from "../components/AddressSelector/AddressSelector";

const CheckOutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar si hay usuario y carrito
  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <Card className="w-full container mx-auto max-w-md mt-20">
          <CardBody className="text-center gap-4">
            <h2 className="text-2xl font-bold">Inicia sesión para continuar</h2>
            <p className="text-gray-600">
              Necesitas estar autenticado para realizar un pedido
            </p>
            <Button color="primary" onClick={() => navigate("/login")}>
              Ir a Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody className="text-center gap-4">
            <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
            <p className="text-gray-600">
              Agrega productos antes de hacer checkout
            </p>
            <Button color="primary" onClick={() => navigate("/products")}>
              Ver Productos
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    // Limpiar error del campo cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const total = cart.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleConfirmOrder = async () => {
    // Validar que se haya seleccionado una dirección
    if (!selectedAddressId) {
      addToast({
        title: "⚠️ Dirección requerida",
        description: "Por favor selecciona una dirección de envío",
        color: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Transformar items del carrito para la orden
      const transformedItems = cart.map((item) => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
        price: item.productId?.price || 0,
      }));

      // Obtener storeId del primer producto (todos los productos deben ser de la misma tienda en un carrito real)
      const storeId = cart[0]?.productId?.storeId;

      if (!storeId) {
        throw new Error(
          "No se pudo obtener la tienda del producto. Recarga la página e intenta de nuevo."
        );
      }

      // 2️⃣ Confirmar orden usando API
      const orderData = await createOrder({
        customerId: user._id,
        storeId: storeId,
        addressId: selectedAddressId,
        items: transformedItems,
      });

      // 3️⃣ Vaciar carrito
      await clearCart();

      // 4️⃣ Navegar a página de confirmación con los datos
      navigate("/confirmation", {
        state: {
          cart: cart,
          total: total,
          customerName: `${user.firstName} ${user.lastName}`,
          orderId: orderData._id,
        },
      });

      addToast({
        title: "✅ Pedido confirmado",
        description: "Tu orden ha sido creada exitosamente",
        color: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Error al confirmar pedido:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "No se pudo confirmar el pedido";

      addToast({
        title: "❌ Error",
        description: errorMessage,
        color: "danger",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Información del usuario y dirección */}
          <div className="space-y-6">
            {/* Información del usuario */}
            <Card>
              <CardBody className="gap-4">
                <h2 className="text-2xl font-bold">Información Personal</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      Nombre
                    </p>
                    <p className="text-lg">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      Apellido
                    </p>
                    <p className="text-lg">{user.lastName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-gray-600">Email</p>
                    <p className="text-lg">{user.email}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Dirección de envío - Address Selector Component */}
            <AddressSelector
              mode="checkout"
              selectedAddressId={selectedAddressId}
              onAddressSelect={(addressId) => setSelectedAddressId(addressId)}
            />
          </div>

          {/* Columna derecha: Resumen del pedido */}
          <div className="space-y-6">
            <Card>
              <CardBody className="gap-4">
                <h2 className="text-2xl font-bold">Resumen del Pedido</h2>

                {/* Productos */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cart.map((item) => {
                    const product = item.productId;
                    if (!product) return null;

                    const itemTotal =
                      (product.price || 0) * (item.quantity || 0);

                    return (
                      <div
                        key={item._id || product._id}
                        className="flex gap-4 pb-4 border-b last:border-b-0"
                      >
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ${(product.price || 0).toFixed(2)} x {item.quantity}
                          </p>
                          <p className="font-semibold text-[#26A69A]">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desglose de costos */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío:</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Impuestos (10%):</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#26A69A] pt-2 border-t">
                    <span>Total:</span>
                    <span>${(total + 5 + total * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <Button
                    color="secondary"
                    onClick={() => navigate("/cart")}
                    disabled={loading}
                    className="flex-1"
                  >
                    Volver al Carrito
                  </Button>
                  <Button
                    color="success"
                    onClick={handleConfirmOrder}
                    loading={loading}
                    className="flex-1 bg-[#26A69A] text-white"
                  >
                    {loading ? "Procesando..." : "Confirmar Pedido"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
