import { Card, CardHeader, CardBody, Switch, Tooltip, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";


export default function SectionToggleCard({
    title,
    description,
    isEnabled,
    onToggle,
    icon: Icon,
    children,
    info,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className={`transition-all ${isEnabled ? "border-primary-300 shadow-md" : "border-gray-200"
                    }`}
            >
                <CardHeader className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        {Icon && (
                            <div className="mt-1">
                                <Icon size={20} className="text-primary" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="text-sm text-gray-600">{description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {info && (
                            <Tooltip content={info} color="foreground">
                                <Info size={16} className="text-gray-400" />
                            </Tooltip>
                        )}
                        <Switch
                            isSelected={!!isEnabled}
                            onValueChange={(value) => {
                                onToggle(value);
                                if (!value) setIsExpanded(false);
                            }}
                            color="primary"
                            size="lg"
                        />
                    </div>
                </CardHeader>

                {isEnabled && children && (
                    <div className="px-6 pb-2">
                        <Button
                            size="sm"
                            variant="bordered"
                            onClick={() => setIsExpanded((v) => !v)}
                        >
                            {isExpanded ? "Minimizar" : "Mostrar opciones"}
                        </Button>
                    </div>
                )}

                {/* Contenido condicional */}
                {isEnabled && isExpanded && children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardBody className="border-t pt-4">{children}</CardBody>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
}
