import { motion } from "framer-motion";
import { Card, CardBody, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

export default function RecentOrders({ orders }) {
    if (!orders || orders.length === 0) return null;

    const columns = [
        { key: "orderNumber", label: "Nº Pedido" },
        { key: "user", label: "Cliente" },
        { key: "store", label: "Tienda" },
        { key: "totalAmount", label: "Total" },
        { key: "status", label: "Estado" },
        { key: "createdAt", label: "Fecha" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "success";
            case "pending":
                return "warning";
            default:
                return "primary";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Pedidos Recientes
            </h2>
            <Card>
                <CardBody className="p-0">
                    <Table aria-label="Tabla de pedidos recientes">
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.key}>
                                    {column.label}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={orders}>
                            {(order) => (
                                <TableRow key={order._id}>
                                    <TableCell>#{order.orderNumber}</TableCell>
                                    <TableCell>
                                        {order.user
                                            ? `${order.user.firstName} ${order.user.lastName}`
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{order.store?.name || "N/A"}</TableCell>
                                    <TableCell className="font-semibold">
                                        €{order.totalAmount?.toFixed(2) || "0.00"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            color={getStatusColor(order.status)}
                                            variant="flat"
                                        >
                                            {order.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString("es-ES")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </motion.div>
    );
}
