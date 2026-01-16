import { useState, useMemo, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Image,
} from "@heroui/react";

const columns = [
    { key: "product", label: "PRODUCTO", sortable: true },
    { key: "views", label: "VISTAS TOTALES", sortable: true },
    { key: "uniqueVisitors", label: "VISITANTES ÚNICOS", sortable: true },
];

export default function TopProductsTable({ products }) {
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "views",
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
                case "views":
                    first = a.views || 0;
                    second = b.views || 0;
                    break;
                case "uniqueVisitors":
                    first = a.uniqueVisitors || 0;
                    second = b.uniqueVisitors || 0;
                    break;
                default:
                    first = a.views || 0;
                    second = b.views || 0;
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
                            src={product.productImage?.url || "/placeholder-product.png"}
                            alt={product.productName || "Producto"}
                            className="w-10 h-10 object-cover rounded"
                            fallbackSrc="/placeholder-product.png"
                        />
                        <span className="font-medium">
                            {product.productName || "Producto eliminado"}
                        </span>
                    </div>
                );
            case "views":
                return (
                    <div className="text-center">
                        <span className="font-semibold text-lg">{product.views?.toLocaleString() || 0}</span>
                    </div>
                );
            case "uniqueVisitors":
                return (
                    <div className="text-center">
                        <span className="font-semibold text-lg">{product.uniqueVisitors?.toLocaleString() || 0}</span>
                    </div>
                );
            default:
                return null;
        }
    }, []);

    if (!products || products.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-500">
                No hay datos de productos vistos
            </div>
        );
    }

    return (
        <Table
            aria-label="Tabla de productos más vistos"
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
