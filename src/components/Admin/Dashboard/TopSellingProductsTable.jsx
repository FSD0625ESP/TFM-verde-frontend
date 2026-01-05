import { useState, useMemo, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Image,
    Chip,
} from "@heroui/react";
import { formatCurrency } from "../../../utils/utils";

const columns = [
    { key: "product", label: "PRODUCTO", sortable: true },
    { key: "totalSold", label: "UNIDADES VENDIDAS", sortable: true },
    { key: "totalRevenue", label: "INGRESOS GENERADOS", sortable: true },
    { key: "orderCount", label: "Nº PEDIDOS", sortable: true },
];

export default function TopSellingProductsTable({ products }) {
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "totalSold",
        direction: "descending",
    });

    const sortedItems = useMemo(() => {
        if (!products || products.length === 0) return [];

        return [...products].sort((a, b) => {
            let first, second;

            switch (sortDescriptor.column) {
                case "product":
                    first = a.productName || "";
                    second = b.productName || "";
                    break;
                case "totalSold":
                    first = a.totalSold || 0;
                    second = b.totalSold || 0;
                    break;
                case "totalRevenue":
                    first = a.totalRevenue || 0;
                    second = b.totalRevenue || 0;
                    break;
                case "orderCount":
                    first = a.orderCount || 0;
                    second = b.orderCount || 0;
                    break;
                default:
                    first = a.totalSold || 0;
                    second = b.totalSold || 0;
            }

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [products, sortDescriptor]);

    const renderCell = useCallback((product, columnKey) => {
        switch (columnKey) {
            case "product":
                return (
                    <div className="flex items-center gap-3">
                        <Image
                            src={product.productImage || "/placeholder-product.png"}
                            alt={product.productName || "Producto"}
                            className="w-10 h-10 object-cover rounded"
                            fallbackSrc="/placeholder-product.png"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {product.productName || "Producto eliminado"}
                            </span>
                            <span className="text-xs text-gray-500">
                                PVP: {formatCurrency(product.productPrice || 0)}
                            </span>
                        </div>
                    </div>
                );
            case "totalSold":
                return (
                    <div className="text-center">
                        <Chip color="success" variant="flat" size="sm">
                            {product.totalSold?.toLocaleString() || 0} uds
                        </Chip>
                    </div>
                );
            case "totalRevenue":
                return (
                    <div className="text-center">
                        <span className="font-semibold text-emerald-600">
                            {formatCurrency(product.totalRevenue || 0)}
                        </span>
                    </div>
                );
            case "orderCount":
                return (
                    <div className="text-center">
                        <span className="font-semibold text-lg">{product.orderCount?.toLocaleString() || 0}</span>
                    </div>
                );
            default:
                return null;
        }
    }, []);

    if (!products || products.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-500">
                No hay datos de productos vendidos
            </div>
        );
    }

    return (
        <Table
            aria-label="Tabla de productos más vendidos"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
                wrapper: "min-h-[200px]",
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.key}
                        allowsSorting={column.sortable}
                        align={column.key === "product" ? "start" : "center"}
                    >
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={sortedItems}>
                {(item) => (
                    <TableRow key={item.productId || item._id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
