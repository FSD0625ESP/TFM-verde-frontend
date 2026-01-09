import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Badge } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatToggler = ({ isOpen, onToggle, unreadCount = 0 }) => {
    return (
        <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <motion.button
                onClick={onToggle}
                className="relative bg-gradient-to-r cursor-pointer from-primary-800 to-secondary-400 text-white rounded-full p-4 shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Badge de mensajes no leídos */}
                {unreadCount > 0 && !isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 right-1"
                    >
                        <Badge
                            content={unreadCount > 99 ? '99+' : unreadCount}
                            color="danger"
                            size="sm"
                            className="border-2 border-white p-3 text-white shadow-lg"
                        />
                    </motion.div>
                )}
            </motion.button>

            {/* Indicador de nuevo mensaje (animación de pulso) */}
            {unreadCount > 0 && !isOpen && (
                <motion.div
                    className="absolute inset-0 bg-primary-500 rounded-full -z-10"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 0, 0.7],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}
        </motion.div>
    );
};

export default ChatToggler;
