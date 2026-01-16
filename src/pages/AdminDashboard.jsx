import { useEffect, useState, useContext, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Spinner,
    addToast,
} from "@heroui/react";
import {
    DollarSign,
    ShoppingCart,
    Users,
    Store,
    Package,
    AlertTriangle,
    Calendar,
} from "lucide-react";
import { getAdminGlobalStats } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/Admin/Dashboard/StatCard";
import RecentOrders from "../components/Admin/Dashboard/RecentOrders";
import ReportsTable from "../components/Admin/Dashboard/ReportsTable";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar que el usuario sea admin
        if (!user || user.role !== "admin") {
            addToast({
                title: "Acceso denegado",
                description: "No tienes permisos para acceder a esta página",
                color: "danger",
                duration: 4000,
            });
            navigate("/");
            return;
        }

        fetchStats();
    }, [user, navigate]);

    const fetchStats = useCallback(async (silent = false) => {
        try {
            // Solo mostrar loading si no hay datos previos o no es una recarga silenciosa
            if (!silent && !stats) {
                setLoading(true);
            }
            const data = await getAdminGlobalStats();
            console.log('Stats received:', data);
            setStats(data);
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            addToast({
                title: "Error",
                description: "No se pudieron cargar las estadísticas",
                color: "danger",
                duration: 4000,
            });
        } finally {
            if (!silent && !stats) {
                setLoading(false);
            }
        }
    }, [stats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" label="Cargando estadísticas..." />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container mx-auto px-6 py-8">
                <p className="text-center text-gray-600">
                    No se pudieron cargar las estadísticas
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Pizarra de Administración
                </h1>
                <p className="text-gray-600">
                    Vista general de las estadísticas de la plataforma
                </p>
            </motion.div>

            {/* Ingresos */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign size={24} className="text-success" />
                    Ingresos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        icon={<DollarSign size={24} className="text-green-600" />}
                        title="Ingresos Totales"
                        value={stats.revenue?.total || 0}
                        subtitle="Acumulado de todos los pedidos completados"
                        description="Suma total de ingresos generados por todos los pedidos completados y entregados en la plataforma desde su inicio"
                        postCountCaracters="€"
                        color="green"
                    />
                    <StatCard
                        icon={<Calendar size={24} className="text-green-600" />}
                        title="Ingresos Hoy"
                        value={stats.revenue?.today || 0}
                        subtitle="Ventas realizadas en las últimas 24 horas"
                        description="Ingresos generados por pedidos completados hoy. Se actualiza en tiempo real con cada nuevo pedido entregado"
                        postCountCaracters="€"
                        color="green"
                    />
                </div>
            </div>

            {/* Pedidos */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ShoppingCart size={24} className="text-primary" />
                    Pedidos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<ShoppingCart size={24} className="text-blue-600" />}
                        title="Pedidos Totales"
                        value={stats.orders?.total || 0}
                        subtitle="Desde el inicio de la plataforma"
                        description="Número total de pedidos realizados en la plataforma, independientemente de su estado actual"
                        color="blue"
                    />
                    <StatCard
                        icon={<Calendar size={24} className="text-blue-600" />}
                        title="Pedidos Hoy"
                        value={stats.orders?.today || 0}
                        subtitle={stats.orders?.today > 0 ? `${stats.orders.today} nuevos` : ""}
                        description="Pedidos realizados en las últimas 24 horas. Incluye todos los estados: pendientes, en proceso y completados"
                        color="blue"
                    />
                    <StatCard
                        icon={<Package size={24} className="text-orange-600" />}
                        title="Pedidos Pendientes"
                        value={stats.orders?.byStatus?.pending || 0}
                        subtitle="En espera de procesamiento"
                        description="Pedidos que aún no han sido procesados por las tiendas. Requieren atención para asignar repartidor y comenzar el proceso de entrega"
                        color="orange"
                    />
                    <StatCard
                        icon={<Package size={24} className="text-emerald-600" />}
                        title="Pedidos Completados"
                        value={stats.orders?.byStatus?.delivered || 0}
                        subtitle="Entregados exitosamente"
                        description="Pedidos que han sido entregados al cliente y marcados como completados. Estos pedidos ya generaron ingresos"
                        color="emerald"
                    />
                </div>
            </div>

            {/* Usuarios */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={24} className="text-secondary" />
                    Usuarios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Users size={24} className="text-purple-600" />}
                        title="Usuarios Totales"
                        value={stats.users?.total || 0}
                        subtitle="Clientes, vendedores y administradores"
                        description="Número total de usuarios registrados en la plataforma. Incluye clientes, vendedores y administradores"
                        color="purple"
                    />
                    <StatCard
                        icon={<Calendar size={24} className="text-purple-600" />}
                        title="Nuevos Hoy"
                        value={stats.users?.newToday || 0}
                        subtitle={stats.users?.newToday > 0 ? `${stats.users.newToday} registros` : ""}
                        description="Usuarios que se han registrado en la plataforma en las últimas 24 horas"
                        color="purple"
                    />
                    <StatCard
                        icon={<Users size={24} className="text-purple-600" />}
                        title="Nuevos Este Mes"
                        value={stats.users?.newThisMonth || 0}
                        subtitle={`${stats.users?.byRole?.customer || 0} clientes, ${stats.users?.byRole?.seller || 0} vendedores`}
                        description="Usuarios que se han registrado durante el mes actual. Ayuda a medir el crecimiento mensual de la plataforma"
                        color="purple"
                    />
                    <StatCard
                        icon={<Store size={24} className="text-purple-600" />}
                        title="Vendedores"
                        value={stats.users?.byRole?.seller || 0}
                        subtitle="Usuarios con tiendas activas"
                        description="Usuarios registrados con rol de vendedor. Pueden crear y gestionar tiendas en la plataforma"
                        color="purple"
                    />
                </div>
            </div>

            {/* Tiendas y Productos */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Store size={24} className="text-primary" />
                    Tiendas y Productos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Store size={24} className="text-indigo-600" />}
                        title="Tiendas Totales"
                        value={stats.stores?.total || 0}
                        subtitle={`${stats.stores?.active || 0} activas, ${stats.stores?.inactive || 0} inactivas`}
                        description="Número total de tiendas creadas en la plataforma. Las tiendas activas están abiertas y pueden recibir pedidos"
                        color="indigo"
                    />
                    <StatCard
                        icon={<Calendar size={24} className="text-indigo-600" />}
                        title="Tiendas Nuevas Hoy"
                        value={stats.stores?.newToday || 0}
                        subtitle="Creadas en las últimas 24 horas"
                        description="Tiendas que han sido creadas por vendedores en las últimas 24 horas"
                        color="indigo"
                    />
                    <StatCard
                        icon={<Package size={24} className="text-blue-600" />}
                        title="Productos Totales"
                        value={stats.products?.total || 0}
                        subtitle={`${stats.products?.active || 0} activos`}
                        description="Número total de productos publicados en todas las tiendas. Los productos activos están visibles para los clientes"
                        color="blue"
                    />
                    <StatCard
                        icon={<Package size={24} className="text-orange-600" />}
                        title="Productos Destacados"
                        value={stats.products?.featured || 0}
                        subtitle={`${stats.products?.onOffer || 0} en oferta`}
                        description="Productos marcados como destacados por las tiendas. Tienen mayor visibilidad en la página principal"
                        color="orange"
                    />
                </div>
            </div>

            {/* Reportes */}
            {stats.reports?.pending > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={24} className="text-danger" />
                        Reportes
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                        <StatCard
                            icon={<AlertTriangle size={24} className="text-orange-600" />}
                            title="Reportes Pendientes"
                            value={stats.reports.pending}
                            subtitle="Requieren atención"
                            description="Reportes de tiendas realizados por usuarios que aún no han sido revisados. Requieren moderación"
                            color="orange"
                        />
                    </div>
                </div>
            )}

            {/* Pedidos Recientes */}
            <RecentOrders orders={stats.orders?.recent} />

            {/* Reportes Detallados */}
            <ReportsTable
                reports={stats.reports?.list}
                totalPending={stats.reports?.pending || 0}
                onReportUpdated={() => fetchStats(true)}
            />
        </div>
    );
}
