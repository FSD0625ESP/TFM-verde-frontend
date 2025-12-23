import { Card, CardBody, CardHeader } from "@heroui/react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function DevicesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">📱 Dispositivos</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        No hay datos de dispositivos
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold">📱 Dispositivos</h2>
            </CardHeader>
            <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}
