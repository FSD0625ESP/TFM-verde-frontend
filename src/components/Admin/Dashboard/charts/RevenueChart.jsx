import { Card, CardBody, CardHeader } from "@heroui/react";
import {
    Area,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
} from "recharts";

export default function RevenueChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <h2 className="text-lg font-semibold">💰 Ingresos y Pedidos Diarios</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        No hay datos de ingresos para mostrar en este período
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <h2 className="text-lg font-semibold">💰 Ingresos y Pedidos Diarios</h2>
            </CardHeader>
            <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" tickFormatter={(value) => `${value}€`} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === "Ingresos") return [`${value.toFixed(2)}€`, name];
                                return [value, name];
                            }}
                        />
                        <Legend />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Ingresos"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="orders"
                            name="Pedidos"
                            stroke="#6366F1"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="itemsSold"
                            name="Items vendidos"
                            fill="#F59E0B"
                            opacity={0.5}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}
