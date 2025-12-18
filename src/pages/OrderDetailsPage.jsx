import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/api";
import { Button, Spinner, Chip } from "@heroui/react";
import { Truck, CheckCircle, Clock, Package, ArrowLeft } from "lucide-react";
import OrderTracker from "../components/OrderTracker/OrderTracker";
import LocationMap from "../components/LocationMap/LocationMap";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getOrderById(id);
        setOrder(res);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: "Pendiente", icon: Clock, color: "amber" },
      shipped: { label: "En camino", icon: Truck, color: "blue" },
      delivered: { label: "Entregado", icon: CheckCircle, color: "green" },
      canceled: { label: "Cancelado", icon: Package, color: "red" },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-red-600 font-semibold">{error}</p>
          <div className="mt-4">
            <Button
              onPress={() => navigate(-1)}
              className="bg-teal-600 text-white"
            >
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const subtotal = (order.items || []).reduce(
    (acc, it) => acc + it.price * it.quantity,
    0
  );
  const shipping = 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              Pedido #{order._id?.slice(-8)}
            </h2>
            <p className="text-sm text-gray-500">
              Creado: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              startContent={<StatusIcon size={14} />}
              variant="flat"
              className="bg-amber-50 text-amber-600"
            >
              {statusInfo.label}
            </Chip>
            <Button
              onPress={() => navigate(-1)}
              className="bg-white border border-gray-200"
            >
              <ArrowLeft size={16} />
              <span className="ml-2">Volver</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Productos</h3>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.productId?.title || `Producto ${i + 1}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        €{item.price.toFixed(2)} c/u
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Sin productos</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Resumen</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>€{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos (10%)</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
              <div className="mt-3 p-3 bg-teal-50 rounded-lg font-bold text-teal-600 flex justify-between">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Dirección</h4>
              {order.addressId ? (
                <div className="text-gray-700 text-sm">
                  <p>{order.addressId.title}</p>
                  <p>
                    {order.addressId.street}, {order.addressId.city}
                  </p>
                  <p>
                    {order.addressId.state} - {order.addressId.postalCode}
                  </p>
                  <p>{order.addressId.country}</p>
                  <p className="mt-2">Tel: {order.addressId.phoneNumber}</p>
                </div>
              ) : (
                <p className="text-gray-500">Sin dirección</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <OrderTracker status={order.status} statusDates={order.statusDates} />
        </div>

        <div>
          <LocationMap status={order.status} address={order.addressId} />
        </div>
      </div>
    </div>
  );
}
