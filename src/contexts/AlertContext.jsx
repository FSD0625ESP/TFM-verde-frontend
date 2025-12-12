import React, { createContext, useContext, useState, useCallback } from "react";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    /**
     * Muestra un toast simple con mensaje
     * @param {Object} options
     * @param {string} options.message - Mensaje a mostrar
     * @param {string} options.type - 'success' | 'danger' | 'warning' | 'info' (default: 'info')
     * @param {number} options.duration - Duración en ms (default: 3000, 0 = no auto-close)
     */
    const addToast = useCallback((options) => {
        const {
            message,
            type = "info",
            duration = 3000,
            title = "",
        } = options;

        const id = Date.now();
        const alert = {
            id,
            message,
            type,
            duration,
            title,
            isDialog: false,
        };

        setAlerts((prev) => [...prev, alert]);

        if (duration > 0) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }

        return id;
    }, []);

    /**
     * Muestra un dialog de confirmación con callbacks
     * @param {Object} options
     * @param {string} options.title - Título del dialog
     * @param {string} options.message - Mensaje del dialog
     * @param {string} options.type - 'danger' | 'warning' | 'info' (default: 'warning')
     * @param {string} options.confirmText - Texto del botón confirmar (default: 'Aceptar')
     * @param {string} options.cancelText - Texto del botón cancelar (default: 'Cancelar')
     * @param {Function} options.onConfirm - Callback al confirmar
     * @param {Function} options.onCancel - Callback al cancelar
     */
    const addAlert = useCallback((options) => {
        const {
            title = "Confirmación",
            message = "",
            type = "warning",
            confirmText = "Aceptar",
            cancelText = "Cancelar",
            onConfirm = () => { },
            onCancel = () => { },
        } = options;

        const id = Date.now();
        const alert = {
            id,
            title,
            message,
            type,
            confirmText,
            cancelText,
            onConfirm,
            onCancel,
            isDialog: true,
        };

        setAlerts((prev) => [...prev, alert]);

        return id;
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    return (
        <AlertContext.Provider value={{ addToast, addAlert, removeAlert }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
                {alerts.map((alert) => (
                    <AlertMessage
                        key={alert.id}
                        alert={alert}
                        onClose={() => removeAlert(alert.id)}
                    />
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert debe ser usado dentro de AlertProvider");
    }
    return context;
};