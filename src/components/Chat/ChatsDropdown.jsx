import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Spinner, Input } from '@heroui/react';
import { Search, MessageCircle, Store as StoreIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserChats } from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';

const ChatsDropdown = ({ isOpen, onSelectChat }) => {
    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [onlineMap, setOnlineMap] = useState({});
    const { onNewMessage, joinChats, requestPresence, onPresenceStatus, onUserOnline, onUserOffline, onMessagesRead } = useSocket();

    useEffect(() => {
        if (isOpen) {
            loadChats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const loadChats = async () => {
        setLoading(true);
        try {
            const data = await getUserChats();
            setChats(data);

            // Unirse a todas las salas de chat
            const chatIds = data.map(chat => chat._id);
            joinChats(chatIds);

            // Solicitar presencia de los participantes
            const userIds = data.map(chat => chat.user._id);
            requestPresence(userIds);
        } catch {
            // silencioso
        } finally {
            setLoading(false);
        }
    };

    // Escuchar estado de presencia inicial
    useEffect(() => {
        if (!isOpen) return;

        const cleanup = onPresenceStatus((status) => {
            setOnlineMap(status);
        });

        return cleanup;
    }, [isOpen, onPresenceStatus]);

    // Escuchar cuando usuarios se conectan/desconectan
    useEffect(() => {
        const cleanupOnline = onUserOnline((data) => {
            setOnlineMap(prev => ({ ...prev, [data.userId]: true }));
        });

        const cleanupOffline = onUserOffline((data) => {
            setOnlineMap(prev => ({ ...prev, [data.userId]: false }));
        });

        return () => {
            if (cleanupOnline) cleanupOnline();
            if (cleanupOffline) cleanupOffline();
        };
    }, [onUserOnline, onUserOffline]);

    // Escuchar nuevos mensajes para actualizar la lista (el backend maneja el contador)
    useEffect(() => {
        const cleanup = onNewMessage((data) => {
            setChats((prevChats) => {
                const updatedChats = prevChats.map((chat) => {
                    if (chat._id === data.chatId) {
                        return {
                            ...chat,
                            lastMessage: {
                                text: data.message.text,
                                timestamp: data.message.timestamp,
                                senderId: data.message.senderId._id,
                            },
                            // El contador lo maneja el backend vía socket
                        };
                    }
                    return chat;
                }).sort((a, b) => {
                    const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp) : 0;
                    const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp) : 0;
                    return timeB - timeA;
                });

                return updatedChats;
            });
        });

        return cleanup;
    }, [onNewMessage]);

    // Escuchar cuando se marcan mensajes como leídos
    useEffect(() => {
        const cleanup = onMessagesRead?.((data) => {
            setChats((prevChats) => {
                return prevChats.map((chat) => {
                    if (chat._id === data.chatId) {
                        return {
                            ...chat,
                            unreadCount: 0,
                        };
                    }
                    return chat;
                });
            });
        });

        return cleanup;
    }, [onMessagesRead]);

    const filteredChats = chats.filter(chat => {
        const searchLower = searchTerm.toLowerCase();
        const userName = `${chat.user.firstName} ${chat.user.lastName}`.toLowerCase();
        const storeName = chat.store.name.toLowerCase();
        return userName.includes(searchLower) || storeName.includes(searchLower);
    }).map(chat => ({
        ...chat,
        isOnline: onlineMap[chat.user._id] === true
    }));

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Ayer';
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('es-ES', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-40"
                >
                    {/* Header */}
                    <div className="bg-linear-to-r from-primary-500 to-secondary-500 text-white p-4">
                        <h3 className="text-xl font-bold mb-3">Mensajes</h3>
                        <Input
                            placeholder="Buscar conversaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startContent={<Search size={18} className="text-gray-400" />}
                            classNames={{
                                inputWrapper: "bg-white/20 backdrop-blur-sm border-white/30",
                                input: "text-white placeholder:text-white/70",
                            }}
                            size="sm"
                        />
                    </div>

                    {/* Lista de chats */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner size="lg" color="primary" />
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <MessageCircle size={48} className="mb-4 opacity-50" />
                                <p className="font-medium">
                                    {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
                                </p>
                                <p className="text-sm mt-2">
                                    {!searchTerm && 'Inicia una conversación con una tienda'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredChats.map((chat) => (
                                    <motion.div
                                        key={chat._id}
                                        onClick={() => onSelectChat(chat)}
                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                        whileHover={{ backgroundColor: '#f9fafb' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <div className="relative">
                                                    <Avatar
                                                        src={chat.user.profileImage || `https://ui-avatars.com/api/?name=${chat.user.firstName}+${chat.user.lastName}&background=random`}
                                                        size="md"
                                                        className="shrink-0"
                                                    />
                                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                </div>
                                                {chat.unreadCount > 0 && (
                                                    <div className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                                                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                                                        {chat.user.firstName} {chat.user.lastName}
                                                    </h4>
                                                    {chat.lastMessage && (
                                                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                                                            {formatTime(chat.lastMessage.timestamp)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                    <StoreIcon size={12} />
                                                    <span className="truncate">{chat.store.name}</span>
                                                </div>

                                                {chat.lastMessage && (
                                                    <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                        {chat.lastMessage.text}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatsDropdown;
