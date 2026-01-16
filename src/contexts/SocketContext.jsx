import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

/**
 * SocketProvider
 *
 * @description
 * Proveedor de contexto (React Context) que inicializa y gestiona una conexión Socket.IO para un usuario autenticado,
 * exponiendo a los componentes hijos el estado de conexión y una API de mensajería/presencia basada en eventos.
 *
 * @behavior
 * - Conecta automáticamente a Socket.IO cuando existe `user` (AuthContext).
 * - Desconecta y limpia el socket cuando no hay usuario o al desmontar el componente.
 * - Usa `withCredentials: true` para enviar cookies (p. ej. httpOnly) en la conexión.
 * - Configura `transports: ['websocket','polling']` para intentar WebSocket primero y hacer fallback a polling.
 * - Mantiene `isConnected` actualizado escuchando eventos: `connect`, `disconnect`, `connect_error`.
 * - Silencia errores genéricos del socket (listener `error` vacío).
 *
 * @contextValue
 * Expone en el contexto:
 * - `socket`: instancia de Socket.IO client o `null`.
 * - `isConnected`: boolean indicando estado de conexión.
 * - `unreadCount` / `setUnreadCount`: estado local para conteo de no leídos.
 *
 * @eventsEmitted
 * - `join_chats` (chatIds): une el socket a múltiples salas/chats.
 * - `send_message` ({ chatId, text }): envía un mensaje a un chat.
 * - `typing` ({ chatId }): notifica que el usuario está escribiendo.
 * - `stop_typing` ({ chatId }): notifica que el usuario dejó de escribir.
 * - `mark_as_read` ({ chatId }): marca mensajes del chat como leídos.
 * - `presence_check` ({ userIds }): solicita estado de presencia (online/offline) de usuarios.
 *
 * @eventsListened
 * Provee helpers para suscripción/desuscripción (devuelven función de cleanup):
 * - `new_message`: llegada de un nuevo mensaje.
 * - `user_typing`: otro usuario escribiendo.
 * - `user_stop_typing`: otro usuario deja de escribir.
 * - `messages_read`: confirmación/actualización de leídos.
 * - `presence_status`: respuesta a `presence_check`.
 * - `user_online`: notificación de usuario conectado.
 * - `user_offline`: notificación de usuario desconectado.
 *
 * @notes
 * - Las funciones `joinChats`, `sendMessage`, etc. sólo emiten si existe `socket` y `isConnected === true`.
 * - Los handlers `onX` registran listeners sobre la instancia actual de `socket` y limpian correctamente con `off`.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children Componentes envueltos por el proveedor.
 * @returns {JSX.Element} Proveedor de SocketContext con la API de Socket.IO.
 */
export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Solo conectar si hay un usuario autenticado
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }
    // Crear conexión de socket - Las cookies se envían automáticamente con withCredentials
    const newSocket = io(
      import.meta.env.VITE_API_URL || "http://localhost:3000",
      {
        withCredentials: true, // Esto enviará las cookies httpOnly automáticamente
        transports: ["websocket", "polling"], // Intentar websocket primero
      }
    );

    // Event listeners
    newSocket.on("connect", () => {
      setIsConnected(true);
      // Forzar el join a todos mis chats (el server también lo hace al conectar)
      newSocket.emit("join_my_chats");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setUnreadCount(0);
    });

    newSocket.on("connect_error", () => {
      setIsConnected(false);
      setUnreadCount(0);
    });

    // Contador total de mensajes no leídos (autoritativo desde el backend)
    newSocket.on("unread_messages_count", (count) => {
      if (typeof count === "number") {
        setUnreadCount(count);
        return;
      }
      // Compatibilidad por si en algún momento se envía un objeto { total }
      setUnreadCount(Number(count?.total || 0));
    });

    newSocket.on("error", () => {
      // Silenciar errores
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const joinChats = useCallback(
    (chatIds) => {
      if (socket && isConnected) {
        console.log("Chat ids", chatIds);
        socket.emit("join_chats", chatIds);
      }
    },
    [socket, isConnected]
  );

  const sendMessage = useCallback(
    (chatId, text) => {
      if (socket && isConnected) {
        socket.emit("send_message", { chatId, text });
      }
    },
    [socket, isConnected]
  );

  const emitTyping = useCallback(
    (chatId) => {
      if (socket && isConnected) {
        socket.emit("typing", { chatId });
      }
    },
    [socket, isConnected]
  );

  const emitStopTyping = useCallback(
    (chatId) => {
      if (socket && isConnected) {
        socket.emit("stop_typing", { chatId });
      }
    },
    [socket, isConnected]
  );

  const markAsRead = useCallback(
    (chatId) => {
      if (socket && isConnected) {
        socket.emit("mark_as_read", { chatId });
      }
    },
    [socket, isConnected]
  );

  const onNewMessage = useCallback(
    (callback) => {
      if (socket) {
        socket.on("new_message", callback);
        return () => socket.off("new_message", callback);
      }
    },
    [socket]
  );

  const onUserTyping = useCallback(
    (callback) => {
      if (socket) {
        socket.on("user_typing", callback);
        return () => socket.off("user_typing", callback);
      }
    },
    [socket]
  );

  const onUserStopTyping = useCallback(
    (callback) => {
      if (socket) {
        socket.on("user_stop_typing", callback);
        return () => socket.off("user_stop_typing", callback);
      }
    },
    [socket]
  );

  const onMessagesRead = useCallback(
    (callback) => {
      if (socket) {
        socket.on("messages_read", callback);
        return () => socket.off("messages_read", callback);
      }
    },
    [socket]
  );

  // =========================
  // Delivery tracking
  // =========================
  const joinDelivery = useCallback(
    (deliveryId) => {
      if (socket && isConnected && deliveryId) {
        socket.emit("join_delivery", { deliveryId });
      }
    },
    [socket, isConnected]
  );

  const onDeliveryUpdate = useCallback(
    (callback) => {
      if (socket) {
        socket.on("delivery_update", callback);
        return () => socket.off("delivery_update", callback);
      }
    },
    [socket]
  );

  // =========================
  // Order tracking (simulado)
  // =========================
  const joinOrder = useCallback(
    (orderId) => {
      if (socket && isConnected && orderId) {
        socket.emit("join_order", { orderId });
      }
    },
    [socket, isConnected]
  );

  const startOrderShipping = useCallback(
    (orderId) => {
      if (socket && isConnected && orderId) {
        socket.emit("start_order_shipping", { orderId });
      }
    },
    [socket, isConnected]
  );

  const onOrderUpdate = useCallback(
    (callback) => {
      if (socket) {
        socket.on("order_update", callback);
        return () => socket.off("order_update", callback);
      }
    },
    [socket]
  );

  // Presencia: solicitar estados y escuchar cambios
  const requestPresence = useCallback(
    (userIds) => {
      if (socket && isConnected) {
        socket.emit("presence_check", { userIds });
      }
    },
    [socket, isConnected]
  );

  const onPresenceStatus = useCallback(
    (callback) => {
      if (socket) {
        socket.on("presence_status", callback);
        return () => socket.off("presence_status", callback);
      }
    },
    [socket]
  );

  const onUserOnline = useCallback(
    (callback) => {
      if (socket) {
        socket.on("user_online", callback);
        return () => socket.off("user_online", callback);
      }
    },
    [socket]
  );

  const onUserOffline = useCallback(
    (callback) => {
      if (socket) {
        socket.on("user_offline", callback);
        return () => socket.off("user_offline", callback);
      }
    },
    [socket]
  );

  const onNewOrder = useCallback(
    (callback) => {
      if (socket) {
        socket.on("new_order_notification", callback);
        return () => socket.off("new_order_notification", callback);
      }
    },
    [socket]
  );

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      joinChats,
      sendMessage,
      emitTyping,
      emitStopTyping,
      markAsRead,
      onNewMessage,
      onUserTyping,
      onUserStopTyping,
      onMessagesRead,
      requestPresence,
      onPresenceStatus,
      onUserOnline,
      onUserOffline,
      joinDelivery,
      onDeliveryUpdate,
      joinOrder,
      startOrderShipping,
      onOrderUpdate,
      unreadCount,
      setUnreadCount,
      onNewOrder,
    }),
    [
      socket,
      isConnected,
      joinChats,
      sendMessage,
      emitTyping,
      emitStopTyping,
      markAsRead,
      onNewMessage,
      onUserTyping,
      onUserStopTyping,
      onMessagesRead,
      requestPresence,
      onPresenceStatus,
      onUserOnline,
      onUserOffline,
      joinDelivery,
      onDeliveryUpdate,
      joinOrder,
      startOrderShipping,
      onOrderUpdate,
      unreadCount,
      setUnreadCount,
      onNewOrder,
    ]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket debe usarse dentro de SocketProvider");
  }
  return context;
};
