import React from "react";
import { Clock, Truck, CheckCircle, XCircle } from "lucide-react";

export default function OrderTracker({ status, statusDates }) {
  const steps = [
    {
      key: "pending",
      label: "Pendiente",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-600",
    },
    {
      key: "shipped",
      label: "En camino",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-600",
    },
    {
      key: "delivered",
      label: "Entregado",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-600",
    },
    {
      key: "canceled",
      label: "Cancelado",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-600",
    },
  ];

  // Determinar qué pasos están completados basado en el status actual
  const getCompletedSteps = (currentStatus) => {
    const statusOrder = {
      pending: 0,
      shipped: 1,
      delivered: 2,
      canceled: 3,
    };

    const currentIndex = statusOrder[currentStatus] || 0;

    if (currentStatus === "canceled") {
      return [0, 3]; // Muestra pendiente y cancelado
    }

    return Array.from({ length: currentIndex + 1 }, (_, i) => i);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const completedSteps = getCompletedSteps(status);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-8 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Estado del pedido
      </h3>

      <div className="relative">
        {/* Timeline visual */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = completedSteps.includes(index);
            const isCurrentStatus = step.key === status;
            const stepDate = statusDates ? statusDates[step.key] : null;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                {/* Círculo del paso */}
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all ${
                    isActive
                      ? `${step.bgColor} ${step.borderColor}`
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <StepIcon
                    size={24}
                    className={`${isActive ? step.color : "text-gray-400"}`}
                  />
                </div>

                {/* Etiqueta */}
                <p
                  className={`text-sm font-medium mt-2 text-center transition-colors ${
                    isActive ? step.color : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {/* Fecha del estado */}
                <p
                  className={`text-xs mt-1 text-center transition-colors ${
                    isActive ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {formatDate(stepDate)}
                </p>

                {/* Indicador de estado actual */}
                {isCurrentStatus && (
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${step.bgColor.replace(
                      "bg-",
                      "bg-"
                    )}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Línea de progreso */}
        <div className="absolute top-7 left-0 right-0 h-1 -z-10">
          <div className="h-full bg-gray-200 rounded-full"></div>
          {/* Línea de progreso rellenada */}
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all ${
              status === "canceled"
                ? "bg-red-600 w-0"
                : status === "pending"
                ? "bg-amber-600 w-0"
                : status === "shipped"
                ? "bg-blue-600 w-1/3"
                : "bg-green-600 w-2/3"
            }`}
          ></div>
        </div>
      </div>

      {/* Detalles adicionales del estado */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          {status === "pending" && (
            <>
              <span className="font-semibold text-amber-600">Pendiente:</span>{" "}
              Tu pedido ha sido recibido y está siendo procesado.
            </>
          )}
          {status === "shipped" && (
            <>
              <span className="font-semibold text-blue-600">En camino:</span> Tu
              pedido ha sido enviado y está en tránsito.
            </>
          )}
          {status === "delivered" && (
            <>
              <span className="font-semibold text-green-600">Entregado:</span>{" "}
              Tu pedido ha sido entregado exitosamente.
            </>
          )}
          {status === "canceled" && (
            <>
              <span className="font-semibold text-red-600">Cancelado:</span> Tu
              pedido ha sido cancelado.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
