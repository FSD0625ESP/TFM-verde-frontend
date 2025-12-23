import { Card, CardBody, Chip } from "@heroui/react";

export default function OrderStatusCards({ ordersByStatus = {} }) {
    return (
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 h-full">
            <CardBody className="flex flex-row items-center justify-around">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Pendientes</p>
                    <Chip color="warning" variant="flat" size="lg">
                        {ordersByStatus.pending || 0}
                    </Chip>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Enviados</p>
                    <Chip color="primary" variant="flat" size="lg">
                        {ordersByStatus.shipped || 0}
                    </Chip>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Entregados</p>
                    <Chip color="success" variant="flat" size="lg">
                        {ordersByStatus.delivered || 0}
                    </Chip>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Cancelados</p>
                    <Chip color="danger" variant="flat" size="lg">
                        {ordersByStatus.canceled || 0}
                    </Chip>
                </div>
            </CardBody>
        </Card>
    );
}
