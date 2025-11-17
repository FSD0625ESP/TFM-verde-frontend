import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

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
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
            withCredentials: true, // Esto enviará las cookies httpOnly automáticamente
            transports: ['websocket', 'polling'], // Intentar websocket primero
        });

        // Event listeners
        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('connect_error', () => {
            setIsConnected(false);
        });

        newSocket.on('error', () => {
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

    const joinChats = useCallback((chatIds) => {
        if (socket && isConnected) {
            socket.emit('join_chats', chatIds);
        }
    }, [socket, isConnected]);

    const sendMessage = useCallback((chatId, text) => {
        if (socket && isConnected) {
            socket.emit('send_message', { chatId, text });
        }
    }, [socket, isConnected]);

    const emitTyping = useCallback((chatId) => {
        if (socket && isConnected) {
            socket.emit('typing', { chatId });
        }
    }, [socket, isConnected]);

    const emitStopTyping = useCallback((chatId) => {
        if (socket && isConnected) {
            socket.emit('stop_typing', { chatId });
        }
    }, [socket, isConnected]);

    const markAsRead = useCallback((chatId) => {
        if (socket && isConnected) {
            socket.emit('mark_as_read', { chatId });
        }
    }, [socket, isConnected]);

    const onNewMessage = useCallback((callback) => {
        if (socket) {
            socket.on('new_message', callback);
            return () => socket.off('new_message', callback);
        }
    }, [socket]);

    const onUserTyping = useCallback((callback) => {
        if (socket) {
            socket.on('user_typing', callback);
            return () => socket.off('user_typing', callback);
        }
    }, [socket]);

    const onUserStopTyping = useCallback((callback) => {
        if (socket) {
            socket.on('user_stop_typing', callback);
            return () => socket.off('user_stop_typing', callback);
        }
    }, [socket]);

    const onMessagesRead = useCallback((callback) => {
        if (socket) {
            socket.on('messages_read', callback);
            return () => socket.off('messages_read', callback);
        }
    }, [socket]);

    // Presencia: solicitar estados y escuchar cambios
    const requestPresence = useCallback((userIds) => {
        if (socket && isConnected) {
            socket.emit('presence_check', { userIds });
        }
    }, [socket, isConnected]);

    const onPresenceStatus = useCallback((callback) => {
        if (socket) {
            socket.on('presence_status', callback);
            return () => socket.off('presence_status', callback);
        }
    }, [socket]);

    const onUserOnline = useCallback((callback) => {
        if (socket) {
            socket.on('user_online', callback);
            return () => socket.off('user_online', callback);
        }
    }, [socket]);

    const onUserOffline = useCallback((callback) => {
        if (socket) {
            socket.on('user_offline', callback);
            return () => socket.off('user_offline', callback);
        }
    }, [socket]);

    const value = useMemo(() => ({
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
    }), [socket, isConnected, joinChats, sendMessage, emitTyping, emitStopTyping, markAsRead, onNewMessage, onUserTyping, onUserStopTyping, onMessagesRead, requestPresence, onPresenceStatus, onUserOnline, onUserOffline]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket debe usarse dentro de SocketProvider');
    }
    return context;
};
