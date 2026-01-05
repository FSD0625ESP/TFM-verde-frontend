import { useEffect, useState, useContext } from "react";
import { Card, CardBody, CardHeader, Spinner, Select, SelectItem } from "@heroui/react";
import { Eye, ShoppingCart, TrendingUp, Package, DollarSign, Receipt } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getStoreDashboard } from "../../../services/api";

// Componentes
import StatCard from "./StatCard";
import TopProductsTable from "./TopProductsTable";
import TopSellingProductsTable from "./TopSellingProductsTable";
import OrderStatusCards from "./OrderStatusCards";
import { RevenueChart, ActivityChart, DevicesChart, BrowsersChart } from "./charts";

// Utilidades
import {
    formatCurrency,
    transformDailyData,
    transformDeviceData,
    transformBrowserData,
    transformRevenueData,
    PERIOD_OPTIONS,
} from "../../../utils/utils";

export default function Dashboard() {
    const { sellerStore } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState("7d");
    const [dashboardData, setDashboardData] = useState(null);

    const fetchDashboard = async () => {
        if (!sellerStore?._id) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getStoreDashboard(sellerStore._id, { period });
            setDashboardData(data);
        } catch (err) {
            console.error("Error al cargar dashboard:", err);
            setError("Error al cargar las estadísticas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [sellerStore?._id, period]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" label="Cargando estadísticas..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Transformar datos
    const dailyData = transformDailyData(dashboardData?.dailyStats);
    const deviceData = transformDeviceData(dashboardData?.deviceStats);
    const browserData = transformBrowserData(dashboardData?.browserStats);
    const revenueData = transformRevenueData(dashboardData?.ordersData?.dailyRevenue);
    const summary = dashboardData?.summary || {};
    const ordersData = dashboardData?.ordersData || {};

    return (
        <div className="p-6 space-y-6">
            {/* Header con selector de período */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard de Analytics</h1>
                <Select
                    label="Período"
                    selectedKeys={[period]}
                    className="w-48"
                    onSelectionChange={(keys) => setPeriod(Array.from(keys)[0])}
                >
                    {PERIOD_OPTIONS.map((option) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                </Select>
            </div>

            {/* Primera fila de tarjetas - Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Ingresos Totales"
                    value={ordersData.totalMoney || 0}
                    subtitle={`Ticket medio: ${formatCurrency(ordersData.averageOrderValue || 0)}`}
                    icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
                    color="emerald"
                    postCountCaracters="€"
                    isLarge
                />
                <StatCard
                    title="Pedidos"
                    value={ordersData.ordersCount || 0}
                    subtitle={`${ordersData.totalItemsSold || 0} productos vendidos`}
                    icon={<Receipt className="w-6 h-6 text-indigo-500" />}
                    color="indigo"
                />
                <StatCard
                    title="Visitas a tienda"
                    value={summary.storeViews?.total || 0}
                    subtitle={`${summary.storeViews?.unique || 0} únicos`}
                    icon={<Eye className="w-6 h-6 text-blue-500" />}
                    color="blue"
                />
                <StatCard
                    title="Vistas de productos"
                    value={summary.productViews?.total || 0}
                    subtitle={`${summary.productViews?.unique || 0} únicos`}
                    icon={<Package className="w-6 h-6 text-green-500" />}
                    color="green"
                />
            </div>

            {/* Segunda fila de tarjetas - Conversión y estados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Añadidos al carrito"
                    value={summary.addToCarts || 0}
                    subtitle={`${summary.addToCartRate || 0}% tasa`}
                    icon={<ShoppingCart className="w-6 h-6 text-orange-500" />}
                    color="orange"
                />
                <StatCard
                    title="Compras registradas"
                    value={summary.purchases || 0}
                    subtitle={`${summary.conversionRate || 0}% conversión`}
                    icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                    color="purple"
                />
                <div className="lg:col-span-2">
                    <OrderStatusCards ordersByStatus={ordersData.ordersByStatus} />
                </div>
            </div>

            {/* Gráfico de Revenue */}
            <RevenueChart data={revenueData} />

            {/* Gráfico de Actividad */}
            <ActivityChart data={dailyData} />

            {/* Gráficos de dispositivos y navegadores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DevicesChart data={deviceData} />
                <BrowsersChart data={browserData} />
            </div>

            {/* Tabla de productos más vistos */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">👁️ Productos más vistos</h2>
                </CardHeader>
                <CardBody>
                    <TopProductsTable products={dashboardData?.topProducts || []} />
                </CardBody>
            </Card>

            {/* Tabla de productos más vendidos */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">🏆 Productos más vendidos</h2>
                </CardHeader>
                <CardBody>
                    <TopSellingProductsTable products={ordersData?.topSellingProducts || []} />
                </CardBody>
            </Card>
        </div>
    );
}
