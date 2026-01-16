import { useEffect, useContext } from "react";
import { addToast } from "@heroui/react";
import { useSocket } from "../contexts/SocketContext";
import { AuthContext } from "../contexts/AuthContext";
import { getPendingNotifications } from "../services/api.js";

export default function GlobalNotifications() {
  const { onNewOrder } = useSocket();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user.role !== "seller") return;

    // Obtener notificaciones no leídas
    getPendingNotifications().then((res) => {
      res.forEach((n) => {
        addToast({
          title: " Nuevo pedido",
          description: "Tienes un pedido pendiente",
          color: "primary",
          duration: 8000,
        });
      });
    });
  }, [user]);

  useEffect(() => {
    // Solo vendedores
    if (!user || user.role !== "seller") return;

    const unsubscribe = onNewOrder((data) => {
      addToast({
        title: " Nuevo pedido",
        description: `${data.totalItems} artículos · ${data.totalPrice} €`,
        color: "primary",
        duration: 8000,
      });
    });

    return unsubscribe;
  }, [onNewOrder, user]);

  return null; // no renderiza nada
}
