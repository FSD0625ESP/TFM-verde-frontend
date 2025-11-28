import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { Avatar, Input, Button, Spinner } from '@heroui/react';
import { X, Send, ArrowLeft, Store as StoreIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatById } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import './Chat.css';

const ChatContainer = ({ chat, onClose, onBack }) => {
    const { user } = useContext(AuthContext);
    const { sendMessage: sendSocketMessage, onNewMessage, emitTyping, emitStopTyping, joinChats, socket, onUserTyping, onUserStopTyping, markAsRead } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const loadMessages = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getChatById(chat._id);
            setMessages(data.messages || []);
        } catch {
            // silencioso
        } finally {
            setLoading(false);
        }
    }, [chat._id]);

    useEffect(() => {
        if (chat) {
            loadMessages();
            inputRef.current?.focus();
            // Unirse a la sala del chat
            joinChats([chat._id]);
            // Marcar mensajes como leídos al abrir el chat
            markAsRead(chat._id);
        }
    }, [chat, loadMessages, joinChats, markAsRead]);

    // Escuchar nuevos mensajes en tiempo real
    useEffect(() => {
        if (!chat) return;

        const cleanup = onNewMessage((data) => {
            if (data.chatId === chat._id) {
                setMessages((prev) => [...prev, data.message]);
                setSending(false);
                // Marcar como leído si la ventana está abierta
                markAsRead(chat._id);
            }
        });

        return cleanup;
    }, [chat, onNewMessage, markAsRead]);

    // Agregar listener para errores del socket
    useEffect(() => {
        if (!chat || !socket) return;

        const handleError = () => {
            setSending(false);
        };

        socket.on('error', handleError);

        return () => {
            socket.off('error', handleError);
        };
    }, [chat, socket]);

    // Escuchar cuando el otro usuario está escribiendo
    useEffect(() => {
        if (!chat || !socket) return;

        const cleanupTyping = onUserTyping((data) => {
            if (data.chatId === chat._id && data.userId !== user?._id) {
                setIsOtherUserTyping(true);
            }
        });

        const cleanupStopTyping = onUserStopTyping((data) => {
            if (data.chatId === chat._id) {
                setIsOtherUserTyping(false);
            }
        });

        return () => {
            if (cleanupTyping) cleanupTyping();
            if (cleanupStopTyping) cleanupStopTyping();
        };
    }, [chat, socket, onUserTyping, onUserStopTyping, user?._id]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom, isOtherUserTyping]); // Scroll cuando cambian mensajes o estado de typing

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || sending) return;

        const messageText = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            sendSocketMessage(chat._id, messageText);
        } catch {
            setSending(false);
        }
    }, [chat._id, newMessage, sending, sendSocketMessage]);

    const handleInputChange = useCallback((e) => {
        setNewMessage(e.target.value);

        // Emitir evento de "escribiendo"
        if (e.target.value.trim()) {
            emitTyping(chat._id);

            // Limpiar timeout anterior
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Dejar de "escribir" después de 2 segundos sin teclear
            typingTimeoutRef.current = setTimeout(() => {
                emitStopTyping(chat._id);
            }, 2000);
        } else {
            emitStopTyping(chat._id);
        }
    }, [chat._id, emitTyping, emitStopTyping]);

    const formatMessageTime = useCallback((timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }, []);

    const formatMessageDate = useCallback((timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hoy';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Ayer';
        } else {
            return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }, []);

    // Agrupar mensajes por fecha
    const groupMessagesByDate = useCallback((messages) => {
        const groups = {};
        messages.forEach(msg => {
            const date = formatMessageDate(msg.timestamp);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return groups;
    }, [formatMessageDate]);

    if (!chat) return null;

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed bottom-24 right-[26rem] w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-40"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <Avatar
                        src={chat.user?.profileImage || `https://ui-avatars.com/api/?name=${chat.user?.firstName || 'User'}+${chat.user?.lastName || ''}&background=random`}
                        size="sm"
                    />

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">
                            {chat.user?.firstName || 'Usuario'} {chat.user?.lastName || ''}
                        </h3>
                        <div className="flex items-center gap-1 text-xs opacity-90">
                            {isOtherUserTyping ? (
                                <span className="italic text-white/90">escribiendo...</span>
                            ) : (
                                <>
                                    <StoreIcon size={12} />
                                    <span className="truncate">{chat.store?.name || 'Tienda'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="lg" color="primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedMessages).map(([date, msgs]) => (
                                <div key={date}>
                                    {/* Separador de fecha */}
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                                            {date}
                                        </div>
                                    </div>

                                    {/* Mensajes de ese día */}
                                    {msgs.map((msg, idx) => {
                                        const senderId = msg.senderId?._id || msg.senderId;
                                        const currentUserId = user?._id;
                                        const isMyMessage = senderId === currentUserId;

                                        return (
                                            <motion.div
                                                key={msg._id || idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
                                            >
                                                <div className={`max-w-[75%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                                                    <div
                                                        className={`rounded-2xl px-4 py-2 ${isMyMessage
                                                            ? 'bg-primary-500 text-white rounded-br-sm'
                                                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                                                            }`}
                                                    >
                                                        <p className="text-sm break-words">{msg.text}</p>
                                                    </div>
                                                    <div className={`flex items-center gap-1 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-xs text-gray-500">
                                                            {formatMessageTime(msg.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Indicador de "escribiendo" */}
                            <AnimatePresence>
                                {isOtherUserTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex justify-start mb-2"
                                    >
                                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <div className="typing-dots">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input de mensaje */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Escribe un mensaje..."
                            size="md"
                            classNames={{
                                inputWrapper: "bg-gray-100",
                            }}
                            disabled={sending}
                        />
                        <Button
                            type="submit"
                            isIconOnly
                            color="primary"
                            isLoading={sending}
                            isDisabled={!newMessage.trim() || sending}
                            className="flex-shrink-0"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatContainer;
