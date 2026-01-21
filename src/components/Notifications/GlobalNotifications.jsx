import { useEffect, useContext, useRef } from "react";
import { addToast, closeToast } from "@heroui/react";
import { useSocket } from "../../contexts/SocketContext.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getPendingNotifications } from "../../services/api.js";
import { Gift } from "lucide-react";

export default function GlobalNotifications() {
  const { onNewOrder } = useSocket();
  const { user } = useContext(AuthContext);
  const toastIdRef = useRef(null);
  const pendingOrdersRef = useRef([]);

  // Manejo de notificaciones pendientes al cargar la página (si el vendedor estuvo ausente)
  useEffect(() => {
    if (!user || user.role !== "seller") return;

    getPendingNotifications().then((res) => {
      //console.log("📦 Notificaciones pendientes:", res.length);
      if (!res || res.length === 0) return;

      // Mapear notificaciones a "pedidos"
      pendingOrdersRef.current = res.map((n) => ({
        totalItems: n.totalItems,
      }));

      // Mostrar toast resumen
      const orders = pendingOrdersRef.current;

      toastIdRef.current = addToast({
        title: (
          <div className="flex items-center gap-2 text-white pb-4">
            <Gift size={40} />
            <span>
              {orders.length === 1
                ? "Pedido recibido mientras estabas ausente"
                : `${orders.length} pedidos recibidos mientras estabas ausente`}
            </span>
          </div>
        ),
        description: (
          <div className="text-white space-y-1 animate-pulse-once pl-2">
            {orders.map((o, idx) => (
              <div key={idx}>
                Pedido {idx + 1}: {o.totalItems} artículos
              </div>
            ))}
            <button
              onClick={() => {
                closeToast(toastIdRef.current);
                toastIdRef.current = null;
                pendingOrdersRef.current = [];
                window.location.href = `${window.location.origin}/store-admin/pedidos`;
              }}
              className="mt-4 ml-2 rounded-md bg-white/80 px-3 py-1 text-sm text-warning font-semibold hover:bg-white/60 transition"
            >
              Ver pedidos
            </button>
          </div>
        ),
        color: "warning",
        variant: "solid",
        duration: 20000,
        hideIcon: true,
        onClose: () => {
          toastIdRef.current = null;
          pendingOrdersRef.current = [];
        },
      });
    });
  }, [user]);

  // Manejo de notificaciones de nuevos pedidos (en tiempo real)
  useEffect(() => {
    if (!user || user.role !== "seller") return;

    const unsubscribe = onNewOrder((data) => {
      // Guardar pedido
      pendingOrdersRef.current.push(data);

      // Si hay toast, lo cerramos para recrearlo (actualización)
      if (toastIdRef.current) {
        closeToast(toastIdRef.current);
      }

      const orders = pendingOrdersRef.current;

      toastIdRef.current = addToast({
        title: (
          <div className="flex items-center gap-2 text-white pb-4">
            <Gift size={40} />
            <span>
              {orders.length === 1
                ? "Nuevo pedido"
                : `${orders.length} nuevos pedidos`}
            </span>
          </div>
        ),
        description: (
          <div className="text-white space-y-1 animate-pulse-once pl-2">
            {orders.map((o, idx) => (
              <div key={idx}>
                Pedido {idx + 1}: {o.totalItems} artículos
              </div>
            ))}
            <button
              onClick={() => {
                closeToast(toastIdRef.current);
                toastIdRef.current = null;
                pendingOrdersRef.current = [];
                window.location.href = `${window.location.origin}/store-admin/pedidos`;
              }}
              className="mt-4 ml-2 rounded-md bg-white/80 px-3 py-1 text-sm text-warning font-semibold hover:bg-white/60 transition"
            >
              Ver pedidos
            </button>
          </div>
        ),
        color: "warning",
        variant: "solid",
        duration: 20000,
        hideIcon: true,
        onClose: () => {
          toastIdRef.current = null;
          pendingOrdersRef.current = [];
        },
      });
    });

    return unsubscribe;
  }, [onNewOrder, user]);

  return null; // no renderiza nada
}
