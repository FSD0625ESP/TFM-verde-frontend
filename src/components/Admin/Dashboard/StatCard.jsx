import { Card, CardBody, Tooltip } from "@heroui/react";
import { Info } from "lucide-react";
import CountUp from "../../utils/CountUp.jsx";


const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    orange: "bg-orange-50 border-orange-200",
    purple: "bg-purple-50 border-purple-200",
    emerald: "bg-emerald-50 border-emerald-200",
    indigo: "bg-indigo-50 border-indigo-200",
};

export default function StatCard({ title, value, subtitle, icon, color, isLarge, postCountCaracters = "", description }) {
    return (
        <Card className={`${colorClasses[color]} border`}>
            <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-white shadow-sm">{icon}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-600">{title}</p>
                        {description && (
                            <Tooltip content={description} color="foreground" placement="top" delay={200}>
                                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            </Tooltip>
                        )}
                    </div>
                    {/* <p className={`${isLarge ? "text-xl" : "text-2xl"} font-bold`}>
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </p> */}
                    <CountUp
                        from={0}
                        to={typeof value === "number" ? value : 0}
                        separator=","
                        direction="up"
                        duration={0.2}
                        className="count-up-text"
                    /> {postCountCaracters}
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </CardBody>
        </Card>
    );
}
