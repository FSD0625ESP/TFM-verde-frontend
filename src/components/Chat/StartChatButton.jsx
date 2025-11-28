import React, { useContext } from 'react';
import { Button } from '@heroui/react';
import { MessageCircle } from 'lucide-react';
import { getOrCreateChat } from '../../services/api';
import { addToast } from '@heroui/react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Botón para iniciar un chat con una tienda
 * Usar en páginas de productos o detalles de tienda
 */
const StartChatButton = ({ storeId, storeName, variant = "flat", size = "md", className = "", onChatCreated }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleStartChat = async () => {
        // Verificar si el usuario está logueado
        if (!user) {
            addToast({
                title: "Inicia sesión",
                description: "Necesitas iniciar sesión para chatear con vendedores",
                color: "warning",
                duration: 4000,
            });
            navigate('/login');
            return;
        }

        try {
            // Crear o obtener el chat con la tienda
            const chatData = await getOrCreateChat(storeId);

            addToast({
                title: "Chat abierto",
                description: `Inicia una conversación con ${storeName}`,
                color: "success",
                duration: 3000,
            });

            // Emitir evento personalizado para abrir el chat
            const event = new CustomEvent('openChat', { detail: chatData });
            window.dispatchEvent(event);

            // Callback opcional
            if (onChatCreated) {
                onChatCreated(chatData);
            }

        } catch (error) {
            addToast({
                title: "Error",
                description: error.response?.data?.msg || "No se pudo iniciar el chat",
                color: "danger",
                duration: 4000,
            });
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            color="primary"
            startContent={<MessageCircle size={18} />}
            onClick={handleStartChat}
            className={className}
        >
            Contactar con {storeName}
        </Button>
    );
};

export default StartChatButton;
