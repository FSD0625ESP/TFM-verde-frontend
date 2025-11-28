import { useState } from "react";

export default function Orders() {
  const [orders] = useState([
    {
      id: "ORD-001",
      fecha: "2025-01-20",
      total: 120.5,
      estado: "Entregado",
      productos: [
        { nombre: "Taza artesanal", cantidad: 1 },
        { nombre: "Vela de soja", cantidad: 2 },
      ],
    },
    {
      id: "ORD-002",
      fecha: "2025-02-10",
      total: 75.0,
      estado: "En camino",
      productos: [{ nombre: "Maceta de cerámica", cantidad: 1 }],
    },
    {
      id: "ORD-003",
      fecha: "2025-03-02",
      total: 52.99,
      estado: "Pendiente",
      productos: [{ nombre: "Cuadro minimalista", cantidad: 1 }],
    },
  ]);

  return (
    <div className="w-full flex justify-center bg-gray-100 py-10">
      <div className="max-w-5xl bg-white p-10 rounded-xl shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-teal-600">Mis Pedidos</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-lg">No tienes pedidos aún.</p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-xl p-6 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  {/* Información del pedido */}
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Pedido #{order.id}
                    </p>
                    <p className="text-gray-600">
                      Fecha: {new Date(order.fecha).toLocaleDateString()}
                    </p>

                    <p className="text-gray-600 mt-1">
                      Total: <strong>€{order.total.toFixed(2)}</strong>
                    </p>

                    <p className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          order.estado === "Entregado"
                            ? "bg-green-600"
                            : order.estado === "En camino"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {order.estado}
                      </span>
                    </p>
                  </div>

                  {/* Botón */}
                  <div className="flex items-center mt-4 md:mt-0">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow">
                      Ver detalles
                    </button>
                  </div>
                </div>

                {/* Productos */}
                <div className="mt-4">
                  <p className="font-medium text-gray-700">Productos:</p>
                  <ul className="list-disc ml-8 text-gray-600">
                    {order.productos.map((p, i) => (
                      <li key={i}>
                        {p.nombre} (x{p.cantidad})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
