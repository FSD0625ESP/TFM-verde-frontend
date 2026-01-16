import React, { useState, useMemo, useContext } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
    Divider,
    Card,
    CardBody,
    Chip,
    Image,
} from "@heroui/react";
import { updateOrderStatus } from "../../../services/api";
import { Package, User as UserIcon, MapPin } from "lucide-react";
import { StoreContext } from "../../../contexts/StoreContext";

const statusOptions = [
    { value: "pending", label: "Pendiente", color: "warning" },
    { value: "shipped", label: "Enviado", color: "primary" },
    { value: "delivered", label: "Entregado", color: "success" },
    { value: "canceled", label: "Cancelado", color: "danger" },
    { value: "returned", label: "Devuelto", color: "default" },
];

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function OrderManager({ isOpen, onClose, order, onOrderUpdated }) {
    const [selectedStatus, setSelectedStatus] = useState(order?.status || "pending");
    const [isUpdating, setIsUpdating] = useState(false);
    const { storeProducts } = useContext(StoreContext);

    // Enriquecer items con datos actualizados del contexto
    const enrichedItems = useMemo(() => {
        if (!order?.items || !storeProducts?.length) return order?.items || [];

        return order.items.map(item => {
            const productInStore = storeProducts.find(p => p._id === item.productId?._id);
            return {
                ...item,
                productId: productInStore || item.productId
            };
        });
    }, [order?.items, storeProducts]);

    // Calcular total del pedido
    const orderTotal = useMemo(() => {
        return enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [enrichedItems]);

    const handleUpdateStatus = async () => {
        try {
            setIsUpdating(true);
            await updateOrderStatus(order._id, selectedStatus);

            if (onOrderUpdated) {
                onOrderUpdated({ ...order, status: selectedStatus });
            }

            onClose();
        } catch (error) {
            console.error("Error actualizando estado del pedido:", error);
            alert("Error al actualizar el estado del pedido");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            scrollBehavior="inside"
            classNames={{
                base: "bg-background",
                backdrop: "bg-black/50",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">
                                Gestionar Pedido #{order._id?.slice(-8)}
                            </h3>
                            <p className="text-small text-default-500 font-normal">
                                Realizado el {formatDate(order.createdAt)}
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            {/* Información del Cliente */}
                            <Card className="mb-4 h-auto overflow-visible">
                                <CardBody className="space-y-2 ">
                                    <div className="flex items-start gap-3">
                                        <UserIcon className="text-default-800 mt-1 text-primary" size={20} />
                                        <div className="flex-1">
                                            <p className="text-small font-semibold">Cliente</p>
                                            <p className="text-default-700">
                                                {order.customerId?.firstName} {order.customerId?.lastName}
                                            </p>
                                            <p className="text-small text-default-700">
                                                {order.customerId?.email}
                                            </p>
                                        </div>
                                    </div>
                                    {order.addressId && (
                                        <>
                                            <Divider className="my-3" />
                                            <div className="flex items-start  gap-3">
                                                <MapPin className="text-default-800 mt-1 text-primary" size={20} />
                                                <div className="flex-1">
                                                    <p className="text-small font-semibold">Dirección de entrega</p>
                                                    <p className="text-default-700">
                                                        {order.addressId.street}
                                                    </p>
                                                    <p className="text-small text-default-700">
                                                        {order.addressId.postalCode} {order.addressId.city}, {order.addressId.state}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Estado del Pedido */}
                            <div className="mb-4">
                                <label className="text-small font-semibold block mb-2">
                                    Estado del Pedido
                                </label>
                                <Select
                                    label="Selecciona el estado"
                                    selectedKeys={[selectedStatus]}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full"
                                    classNames={{
                                        trigger: "h-12",
                                    }}
                                >
                                    {statusOptions.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                            textValue={status.label}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Chip
                                                    color={status.color}
                                                    size="sm"
                                                    variant="flat"
                                                    className="capitalize"
                                                >
                                                    {status.label}
                                                </Chip>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <Divider className="my-4" />

                            {/* Productos del Pedido */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="text-default-500 text-primary" size={20} />
                                    <h4 className="text-small font-semibold">
                                        Productos del pedido
                                    </h4>
                                </div>

                                {!order.items?.length ? (
                                    <Card>
                                        <CardBody>
                                            <p className="text-center text-default-400">
                                                No hay productos en este pedido
                                            </p>
                                        </CardBody>
                                    </Card>
                                ) : (
                                    <div className="space-y-3">
                                        {enrichedItems.map((item, index) => (
                                            <Card key={index} className="border-1 border-default-200">
                                                <CardBody>
                                                    <div className="flex gap-4">
                                                        <div className="relative">
                                                            <Image
                                                                src={item.productId?.images?.[0]?.url || item.productId?.image}
                                                                alt={item.productId?.name}
                                                                className="w-20 h-20 object-cover rounded-lg"
                                                                fallbackSrc="/placeholder-product.png"
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <p className="font-semibold text-default-900">
                                                                    {item.productId?.title}
                                                                </p>
                                                                <p className="text-small text-default-700">
                                                                    Cantidad: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-small text-default-600">
                                                                    {item.price.toFixed(2)} € c/u
                                                                </p>
                                                                <p className="font-semibold text-lg">
                                                                    {(item.price * item.quantity).toFixed(2)} €
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}

                                        {/* Total */}
                                        <Card className="bg-primary-50 dark:bg-primary-100/10 border-1 border-primary-200">
                                            <CardBody>
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-lg">Total del pedido</p>
                                                    <p className="font-bold text-2xl text-primary">
                                                        {orderTotal.toFixed(2)} €
                                                    </p>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleUpdateStatus}
                                isLoading={isUpdating}
                                isDisabled={selectedStatus === order.status}
                            >
                                Actualizar Estado
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
