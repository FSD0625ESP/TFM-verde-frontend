import { Card, CardBody, CardHeader } from "@heroui/react";
import { Globe } from "lucide-react";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function BrowsersChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Navegadores
                    </h2>
                </CardHeader>
                <CardBody>
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        No hay datos de navegadores
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Navegadores
                </h2>
            </CardHeader>
            <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" name="Visitas" fill="#8884D8">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}
