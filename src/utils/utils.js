export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const generateUserLog = (action, details) => {
    // TODO: Implementar logging de usuario
}

// ==================== DASHBOARD UTILS ====================

/**
 * Formatear valor como moneda EUR
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado como moneda
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(value);
};

/**
 * Transformar datos diarios de analytics para gráficos
 * @param {Array} dailyStats - Estadísticas diarias del backend
 * @returns {Array} Datos transformados para Recharts
 */
export const transformDailyData = (dailyStats) => {
    if (!dailyStats) return [];

    return dailyStats.map((day) => {
        const result = { date: day._id };
        day.events.forEach((event) => {
            result[event.eventType] = event.count;
        });
        return result;
    });
};

/**
 * Transformar datos de dispositivos para gráfico de pie
 * @param {Array} deviceStats - Estadísticas de dispositivos
 * @returns {Array} Datos transformados para Recharts
 */
export const transformDeviceData = (deviceStats) => {
    if (!deviceStats) return [];

    return deviceStats.map((device) => ({
        name: device._id || "desktop",
        value: device.count,
    }));
};

/**
 * Transformar datos de navegadores para gráfico de barras
 * @param {Array} browserStats - Estadísticas de navegadores
 * @returns {Array} Datos transformados para Recharts
 */
export const transformBrowserData = (browserStats) => {
    if (!browserStats) return [];

    return browserStats.map((browser) => ({
        name: browser._id || "Desconocido",
        value: browser.count,
    }));
};

/**
 * Transformar datos de revenue diario para gráfico
 * @param {Array} dailyRevenue - Revenue diario del backend
 * @returns {Array} Datos transformados para Recharts
 */
export const transformRevenueData = (dailyRevenue) => {
    if (!dailyRevenue) return [];

    return dailyRevenue.map((day) => ({
        date: day._id,
        revenue: day.revenue,
        orders: day.orders,
        itemsSold: day.itemsSold,
    }));
};

/**
 * Opciones de período para el selector de Dashboard
 */
export const PERIOD_OPTIONS = [
    { key: "24h", label: "Últimas 24 horas" },
    { key: "7d", label: "Últimos 7 días" },
    { key: "30d", label: "Últimos 30 días" },
    { key: "90d", label: "Últimos 90 días" },
    { key: "year", label: "Último año" },
];

