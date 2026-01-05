import { Card, CardBody, CardHeader } from "@heroui/react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function ActivityChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <h2 className="text-lg font-semibold">📊 Actividad diaria</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        No hay datos para mostrar en este período
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <h2 className="text-lg font-semibold">📊 Actividad diaria</h2>
            </CardHeader>
            <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCart" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#FFBB28" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="view_store"
                            name="Visitas tienda"
                            stroke="#0088FE"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                        />
                        <Area
                            type="monotone"
                            dataKey="view_product"
                            name="Vistas productos"
                            stroke="#00C49F"
                            fillOpacity={1}
                            fill="url(#colorProducts)"
                        />
                        <Area
                            type="monotone"
                            dataKey="add_to_cart"
                            name="Añadidos carrito"
                            stroke="#FFBB28"
                            fillOpacity={1}
                            fill="url(#colorCart)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}
