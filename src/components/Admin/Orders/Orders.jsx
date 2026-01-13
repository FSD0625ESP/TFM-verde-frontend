import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
    Chip,
    User,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Input,
} from "@heroui/react";
import { getAdminOrders } from "../../../services/api";
import { ChevronDown, Search, Settings, Package, User as UserIcon } from "lucide-react";
import OrderManager from "./OrderManager";

const statusColorMap = {
    pending: "warning",
    shipped: "primary",
    delivered: "success",
    canceled: "danger",
    returned: "default",
};

const statusTextMap = {
    pending: "Pendiente",
    shipped: "Enviado",
    delivered: "Entregado",
    canceled: "Cancelado",
    returned: "Devuelto",
};

const columns = [
    { uid: "orderId", name: "ID Pedido", sortable: true },
    { uid: "user", name: "Usuario", sortable: false },
    { uid: "items", name: "Productos", sortable: false },
    { uid: "total", name: "Total", sortable: true },
    { uid: "status", name: "Estado", sortable: true },
    { uid: "createdAt", name: "Fecha", sortable: true },
    { uid: "actions", name: "Acciones", sortable: false },
];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "createdAt",
        direction: "descending",
    });
    const [filterValue, setFilterValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce para la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(filterValue);
            setPage(1); // Resetear a la primera página al buscar
        }, 500); // 500ms de debounce

        return () => clearTimeout(timer);
    }, [filterValue]);

    // Cargar órdenes desde el backend
    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            const sortOrder = sortDescriptor.direction === "descending" ? "desc" : "asc";
            const data = await getAdminOrders({
                page,
                limit: rowsPerPage,
                sortBy: sortDescriptor.column,
                sortOrder,
                search: searchValue, // Enviar búsqueda al backend
            });
            console.log("Órdenes cargadas:", data);
            setOrders(data.orders || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotal(data.pagination?.total || 0);
        } catch (error) {
            console.error("Error cargando órdenes:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, sortDescriptor, searchValue]); // Agregar searchValue a dependencias

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Ya no necesitamos filtrar en el frontend, el backend lo hace
    const filteredOrders = orders;

    // Calcular total de la orden
    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // Formatear fecha
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Renderizar celda
    const renderCell = useCallback((order, columnKey) => {
        const cellValue = order[columnKey];

        switch (columnKey) {
            case "orderId":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small font-mono">
                            #{order._id?.slice(-8)}
                        </p>
                    </div>
                );
            case "user": {
                const avatarSrc = order.customerId?.profileImage?.trim()
                    ? order.customerId.profileImage
                    : order.customerId?.image?.trim()
                        ? order.customerId.image
                        : null;

                const firstName = order.customerId?.firstName || "";
                const lastName = order.customerId?.lastName || "";
                const initials = `${firstName.charAt(0)} ${lastName.charAt(0)}`.toUpperCase();
                console.log("Iniciales del usuario:", initials);

                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            src: avatarSrc,
                            name: initials || "U",
                        }}
                        name={`${firstName} ${lastName}`}
                    >
                        {firstName} {lastName}
                    </User>
                );
            }
            case "items": {
                const itemCount = order.items?.length || 0;
                const firstProduct = order.items?.[0]?.productId;
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {firstProduct?.title || "Producto"}
                        </p>
                        {itemCount > 1 && (
                            <p className="text-bold text-tiny capitalize text-default-400">
                                +{itemCount - 1} más
                            </p>
                        )}
                    </div>
                );
            }
            case "total": {
                const total = calculateTotal(order.items || []);
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">
                            {total.toFixed(2)} €
                        </p>
                    </div>
                );
            }
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[order.status]}
                        size="sm"
                        variant="flat"
                    >
                        {statusTextMap[order.status]}
                    </Chip>
                );
            case "createdAt":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => {
                                setSelectedOrder(order);
                                setIsModalOpen(true);
                            }}
                        >
                            <Settings className="text-default-400" size={18} />
                        </Button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    // Top content con búsqueda y filtros
    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por ID, usuario, email o estado..."
                        startContent={<Search size={18} />}
                        value={filterValue}
                        onClear={() => setFilterValue("")}
                        onValueChange={setFilterValue}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDown size={16} />}
                                    variant="flat"
                                >
                                    Filas por página
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Filas por página"
                                selectedKeys={new Set([String(rowsPerPage)])}
                                selectionMode="single"
                                onSelectionChange={(keys) => {
                                    setRowsPerPage(Number(Array.from(keys)[0]));
                                    setPage(1);
                                }}
                            >
                                <DropdownItem key="5">5</DropdownItem>
                                <DropdownItem key="10">10</DropdownItem>
                                <DropdownItem key="15">15</DropdownItem>
                                <DropdownItem key="20">20</DropdownItem>
                                <DropdownItem key="50">50</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total de {total} pedidos
                    </span>
                </div>
            </div>
        );
    }, [filterValue, rowsPerPage, total]);

    // Bottom content con paginación
    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {filteredOrders.length > 0 && (
                        <>
                            Mostrando {(page - 1) * rowsPerPage + 1} a{" "}
                            {Math.min(page * rowsPerPage, total)} de {total}
                        </>
                    )}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={page === 1}
                        size="sm"
                        variant="flat"
                        onPress={() => setPage(page - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        isDisabled={page === totalPages}
                        size="sm"
                        variant="flat"
                        onPress={() => setPage(page + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    }, [page, totalPages, total, rowsPerPage, filteredOrders.length]);

    return (
        <div className="w-full p-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Mis Pedidos</h1>
                <p className="text-default-500">
                    Gestiona y visualiza todos tus pedidos
                </p>
            </div>

            <Table
                aria-label="Tabla de pedidos con paginación y ordenación del servidor"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"

                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={
                        loading ? (
                            <Spinner label="Cargando pedidos..." />
                        ) : (
                            "No se encontraron pedidos"
                        )
                    }
                    items={filteredOrders}
                    isLoading={loading}
                    loadingContent={<Spinner label="Cargando..." />}
                >
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal de gestión de pedido */}
            <OrderManager
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onOrderUpdated={(updatedOrder) => {
                    setOrders((prev) =>
                        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
                    );
                }}
            />
        </div>
    );
}
