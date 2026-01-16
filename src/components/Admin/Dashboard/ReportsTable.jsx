import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Chip, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, addToast, Pagination } from "@heroui/react";
import { AlertTriangle, Search } from "lucide-react";
import { updateReportStatus } from "../../../services/api";

export default function ReportsTable({ reports, totalPending, onReportUpdated }) {
    const [searchReport, setSearchReport] = useState("");
    const [filterReason, setFilterReason] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [updatingReports, setUpdatingReports] = useState({});
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    if (!reports || reports.length === 0) return null;

    const columns = [
        { key: "createdAt", label: "Fecha" },
        { key: "storeId", label: "Tienda" },
        { key: "reporterId", label: "Reportado por" },
        { key: "reason", label: "Motivo" },
        { key: "description", label: "Descripción" },
        { key: "status", label: "Estado" },
    ];

    const reasonOptions = [
        { key: "all", label: "Todos los motivos" },
        { key: "spam", label: "Spam o contenido no deseado" },
        { key: "inappropriate", label: "Contenido inapropiado" },
        { key: "other", label: "Otro motivo" },
    ];

    const statusOptions = [
        { key: "all", label: "Todos los estados" },
        { key: "pending", label: "Pendiente" },
        { key: "reviewed", label: "Revisado" },
        { key: "resolved", label: "Resuelto" },
    ];

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            setUpdatingReports(prev => ({ ...prev, [reportId]: true }));
            await updateReportStatus(reportId, newStatus);
            addToast({
                title: "Éxito",
                description: "Estado del reporte actualizado correctamente",
                color: "success",
                duration: 3000,
            });
            // Notificar al componente padre para que recargue los datos
            if (onReportUpdated) {
                onReportUpdated();
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            addToast({
                title: "Error",
                description: "No se pudo actualizar el estado del reporte",
                color: "danger",
                duration: 4000,
            });
        } finally {
            setUpdatingReports(prev => ({ ...prev, [reportId]: false }));
        }
    };

    const getReasonColor = (reason) => {
        switch (reason) {
            case "spam":
                return "warning";
            case "inappropriate":
                return "danger";
            default:
                return "default";
        }
    };

    const getReasonLabel = (reason) => {
        switch (reason) {
            case "spam":
                return "Spam";
            case "inappropriate":
                return "Inapropiado";
            default:
                return "Otro";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "reviewed":
                return "primary";
            case "resolved":
                return "success";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending":
                return "Pendiente";
            case "reviewed":
                return "Revisado";
            case "resolved":
                return "Resuelto";
            default:
                return status;
        }
    };

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchSearch =
                searchReport === "" ||
                report.storeId?.name?.toLowerCase().includes(searchReport.toLowerCase()) ||
                `${report.reporterId?.firstName} ${report.reporterId?.lastName}`
                    .toLowerCase()
                    .includes(searchReport.toLowerCase());
            const matchReason = filterReason === "all" || report.reason === filterReason;
            const matchStatus = filterStatus === "all" || report.status === filterStatus;
            return matchSearch && matchReason && matchStatus;
        });
    }, [reports, searchReport, filterReason, filterStatus]);

    const pages = Math.ceil(filteredReports.length / rowsPerPage);

    const paginatedReports = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredReports.slice(start, end);
    }, [filteredReports, page]);

    // Reset page cuando cambian los filtros
    const handleSearchChange = (value) => {
        setSearchReport(value);
        setPage(1);
    };

    const handleReasonChange = (value) => {
        setFilterReason(value);
        setPage(1);
    };

    const handleStatusFilterChange = (value) => {
        setFilterStatus(value);
        setPage(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-danger" />
                Reportes de Tiendas ({totalPending})
            </h2>

            {/* Filtros */}
            <Card className="mb-4">
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Buscar por tienda o usuario..."
                            startContent={<Search size={18} />}
                            value={searchReport}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            variant="bordered"
                        />
                        <Select
                            placeholder="Filtrar por motivo"
                            selectedKeys={[filterReason]}
                            onSelectionChange={(keys) => handleReasonChange(Array.from(keys)[0])}
                            variant="bordered"
                        >
                            {reasonOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            placeholder="Filtrar por estado"
                            selectedKeys={[filterStatus]}
                            onSelectionChange={(keys) => handleStatusFilterChange(Array.from(keys)[0])}
                            variant="bordered"
                        >
                            {statusOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </CardBody>
            </Card>

            {/* Tabla de Reportes */}
            <Card>
                <CardBody className="p-0">
                    <Table
                        aria-label="Tabla de reportes de tiendas"
                        bottomContent={
                            pages > 1 ? (
                                <div className="flex w-full justify-center py-4">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="primary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>
                            ) : null
                        }
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.key}>
                                    {column.label}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={paginatedReports} emptyContent="No se encontraron reportes con los filtros aplicados">
                            {(report) => (
                                <TableRow key={report._id}>
                                    <TableCell className="text-gray-600">
                                        {new Date(report.createdAt).toLocaleDateString("es-ES")}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {report.storeId?.name || "Tienda eliminada"}
                                    </TableCell>
                                    <TableCell>
                                        {report.reporterId
                                            ? `${report.reporterId.firstName} ${report.reporterId.lastName}`
                                            : "Usuario eliminado"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            color={getReasonColor(report.reason)}
                                            variant="flat"
                                        >
                                            {getReasonLabel(report.reason)}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-gray-600 max-w-xs truncate">
                                        {report.description || "Sin descripción"}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            size="sm"
                                            selectedKeys={[report.status || "pending"]}
                                            onSelectionChange={(keys) => {
                                                const newStatus = Array.from(keys)[0];
                                                if (newStatus && newStatus !== report.status) {
                                                    handleStatusChange(report._id, newStatus);
                                                }
                                            }}
                                            isDisabled={updatingReports[report._id]}
                                            className="min-w-[130px]"
                                            aria-label="Cambiar estado del reporte"
                                            disallowEmptySelection
                                        >
                                            <SelectItem key="pending">Pendiente</SelectItem>
                                            <SelectItem key="reviewed">Revisado</SelectItem>
                                            <SelectItem key="resolved">Resuelto</SelectItem>
                                        </Select>
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
