import React, { useState, useEffect } from "react";
import { MapPin, Truck, MapPinCheck } from "lucide-react";

export default function LocationMap({ status, address }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simular carga del mapa
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Generar coordenadas simuladas basadas en el ID del pedido
  const generateFakeCoords = () => {
    const randomLat = 40.4168 + (Math.random() - 0.5) * 0.2;
    const randomLng = -3.7038 + (Math.random() - 0.5) * 0.2;
    return { lat: randomLat, lng: randomLng };
  };

  const coords = generateFakeCoords();

  // Punto de origen (tienda)
  const storeOrigin = { lat: 40.4168, lng: -3.7038, name: "Tienda Central" };

  // Punto de destino (dirección del cliente)
  const destination = {
    lat: coords.lat,
    lng: coords.lng,
    name: address?.title || "Dirección de entrega",
  };

  // Calcular porcentaje de progreso según el estado
  const getProgressPercentage = () => {
    const progressMap = {
      pending: 0,
      shipped: 50,
      delivered: 100,
      canceled: 0,
    };
    return progressMap[status] || 0;
  };

  // Calcular posición del camión en la ruta
  const progress = getProgressPercentage() / 100;
  const truckLat =
    storeOrigin.lat + (destination.lat - storeOrigin.lat) * progress;
  const truckLng =
    storeOrigin.lng + (destination.lng - storeOrigin.lng) * progress;

  // Escala de pixels para el mapa (conversión simplificada de coordenadas)
  const mapWidth = 600;
  const mapHeight = 300;
  const latRange = Math.abs(destination.lat - storeOrigin.lat) * 1.5;
  const lngRange = Math.abs(destination.lng - storeOrigin.lng) * 1.5;
  const centerLat = (storeOrigin.lat + destination.lat) / 2;
  const centerLng = (storeOrigin.lng + destination.lng) / 2;

  const latToPixel = (lat) => {
    return ((centerLat - lat) / latRange) * mapHeight + mapHeight / 2;
  };

  const lngToPixel = (lng) => {
    return ((lng - centerLng) / lngRange) * mapWidth + mapWidth / 2;
  };

  const storePixelX = lngToPixel(storeOrigin.lng);
  const storePixelY = latToPixel(storeOrigin.lat);
  const destPixelX = lngToPixel(destination.lng);
  const destPixelY = latToPixel(destination.lat);
  const truckPixelX = lngToPixel(truckLng);
  const truckPixelY = latToPixel(truckLat);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-8 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Ubicación del pedido
      </h3>

      {/* Contenedor del mapa fake */}
      <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden border border-blue-200 relative">
        <svg
          width={mapWidth}
          height={mapHeight}
          className="w-full h-auto"
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        >
          {/* Fondo del mapa */}
          <defs>
            <linearGradient
              id="mapGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
          </defs>

          {/* Línea de ruta */}
          <line
            x1={storePixelX}
            y1={storePixelY}
            x2={destPixelX}
            y2={destPixelY}
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="5,5"
          />

          {/* Línea de progreso */}
          {status !== "pending" && status !== "canceled" && (
            <line
              x1={storePixelX}
              y1={storePixelY}
              x2={truckPixelX}
              y2={truckPixelY}
              stroke="#3b82f6"
              strokeWidth="3"
            />
          )}

          {/* Punto de origen (Tienda) */}
          <circle
            cx={storePixelX}
            cy={storePixelY}
            r="10"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="2"
          />

          {/* Punto de destino */}
          <circle
            cx={destPixelX}
            cy={destPixelY}
            r="10"
            fill={status === "delivered" ? "#10b981" : "#f59e0b"}
            stroke={status === "delivered" ? "#047857" : "#d97706"}
            strokeWidth="2"
          />

          {/* Camión/icono de envío */}
          {status === "shipped" && (
            <>
              <circle
                cx={truckPixelX}
                cy={truckPixelY}
                r="8"
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="2"
              />
              <rect
                x={truckPixelX - 6}
                y={truckPixelY - 6}
                width="12"
                height="12"
                fill="#60a5fa"
                stroke="#3b82f6"
                strokeWidth="1"
              />
            </>
          )}
        </svg>
      </div>

      {/* Información de ubicación */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Origen */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} className="text-green-600" />
            <p className="font-semibold text-green-900">Origen</p>
          </div>
          <p className="text-sm text-green-700">{storeOrigin.name}</p>
          <p className="text-xs text-green-600 mt-1">
            {storeOrigin.lat.toFixed(4)}, {storeOrigin.lng.toFixed(4)}
          </p>
        </div>

        {/* Destino */}
        <div
          className={`p-4 rounded-lg border ${
            status === "delivered"
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPinCheck
              size={18}
              className={
                status === "delivered" ? "text-green-600" : "text-amber-600"
              }
            />
            <p
              className={`font-semibold ${
                status === "delivered" ? "text-green-900" : "text-amber-900"
              }`}
            >
              Destino
            </p>
          </div>
          <p
            className={`text-sm ${
              status === "delivered" ? "text-green-700" : "text-amber-700"
            }`}
          >
            {destination.name}
          </p>
          <p
            className={`text-xs mt-1 ${
              status === "delivered" ? "text-green-600" : "text-amber-600"
            }`}
          >
            {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Información de estado de envío */}
      {status === "shipped" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} className="text-blue-600" />
            <p className="font-semibold text-blue-900">En tránsito</p>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Tu pedido está en ruta hacia el destino. {getProgressPercentage()}%
            completado.
          </p>
        </div>
      )}

      {status === "pending" && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            Tu pedido está siendo preparado en la tienda para su envío.
          </p>
        </div>
      )}

      {status === "delivered" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ Tu pedido ha llegado a su destino.
          </p>
        </div>
      )}

      {status === "canceled" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">El pedido ha sido cancelado.</p>
        </div>
      )}
    </div>
  );
}
