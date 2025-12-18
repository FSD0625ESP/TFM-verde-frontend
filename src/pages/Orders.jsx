import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Card, CardBody, Button, Spinner, Chip } from "@heroui/react";
import { getOrders as fetchOrdersAPI } from "../services/api";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) {
      console.log("⚠️ No hay usuario autenticado");
      setLoading(false);
      return;
    }

    console.log("🔍 Iniciando fetch de órdenes para usuario:", user._id);
    setLoading(true);
    try {
      console.log("🔍 Solicitando órdenes al servidor...");
      const response = await fetchOrdersAPI();
      console.log("📦 Órdenes recibidas:", response);
      setOrders(response || []);
      setError(null);
    } catch (err) {
      console.error(
        "❌ Error al obtener pedidos:",
        err.response?.data || err.message || err
      );
      setError("No se pudieron cargar los pedidos");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Reload cada vez que la página se hace visible (vuelves a la pestaña)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log("📄 Página visible - recargando pedidos");
        fetchOrders();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Pendiente",
        color: "warning",
        icon: Clock,
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
      },
      shipped: {
        label: "En camino",
        color: "info",
        icon: Truck,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      delivered: {
        label: "Entregado",
        color: "success",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      canceled: {
        label: "Cancelado",
        color: "danger",
        icon: Package,
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const calculateTotal = (items) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = 5;
    const tax = subtotal * 0.1;
    return subtotal + shipping + tax;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Mis Pedidos
            </h1>
            <p className="text-gray-500 text-lg mb-6">
              Inicia sesión para ver tus pedidos
            </p>
            <Button
              color="primary"
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" color="success" />
          <p className="mt-4 text-gray-600 font-medium">
            Cargando tus pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Mis Pedidos
            </h1>
            <p className="text-gray-600">
              {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}{" "}
              registrado{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            isIconOnly
            className="bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
            onPress={fetchOrders}
            isLoading={loading}
          >
            <RefreshCw size={20} />
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <p className="font-semibold">⚠️ Error al cargar pedidos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No hay pedidos
            </h2>
            <p className="text-gray-600 mb-6">
              Aún no has realizado ningún pedido.
            </p>
            <Button
              color="primary"
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => navigate("/stores")}
            >
              ¡Empieza a comprar!
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const total = calculateTotal(order.items || []);
              const isExpanded = expandedOrderId === order._id;

              return (
                <div key={order._id} className="group">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#26A69A] overflow-hidden">
                    {/* Order Header - Clickable */}
                    <div
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order._id)
                      }
                      className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-5 cursor-pointer hover:from-teal-100 hover:to-cyan-100 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              Pedido #{order._id?.slice(-8) || "N/A"}
                            </h3>
                            <Chip
                              startContent={<StatusIcon size={16} />}
                              variant="flat"
                              className={`${statusInfo.bgColor} ${statusInfo.textColor}`}
                            >
                              {statusInfo.label}
                            </Chip>
                          </div>
                          <p className="text-sm text-gray-600">
                            📅{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "es-ES",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right flex-shrink-0">
                            <p className="text-3xl font-bold text-teal-600">
                              €{total.toFixed(2)}
                            </p>
                          </div>

                          <Button
                            color="primary"
                            className="bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/orders/${order._id}`);
                            }}
                          >
                            Detalles
                          </Button>

                          <button className="text-gray-600 hover:text-gray-900 ml-2 shrink-0">
                            <ChevronDown
                              size={24}
                              className={`transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Body - Expandable */}
                    {isExpanded && (
                      <div className="px-6 py-6 space-y-6 border-t border-gray-200">
                        {/* Products */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                            Productos ({order.items?.length || 0})
                          </h4>
                          <div className="space-y-3">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      {item.productId?.title ||
                                        `Producto ${i + 1}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Cantidad:{" "}
                                      <span className="font-semibold text-gray-700">
                                        {item.quantity}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                      €{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      €{item.price.toFixed(2)} c/u
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-center py-4">
                                Sin productos
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span className="font-medium">
                              €
                              {order.items
                                .reduce(
                                  (acc, item) =>
                                    acc + item.price * item.quantity,
                                  0
                                )
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Envío:</span>
                            <span className="font-medium">€5.00</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Impuestos (10%):</span>
                            <span className="font-medium">
                              €
                              {(
                                order.items.reduce(
                                  (acc, item) =>
                                    acc + item.price * item.quantity,
                                  0
                                ) * 0.1
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
