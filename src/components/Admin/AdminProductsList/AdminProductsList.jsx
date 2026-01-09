import { useContext, useMemo, useState, useCallback } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Tooltip,
  Spinner,
  addToast,
} from "@heroui/react";
import {
  Edit,
  Trash2,
  Store,
  Tag,
  Star,
  EyeOff,
  Search,
  ChevronDown,
  Plus,
  MoreVertical,
  Eye,
} from "lucide-react";

import { StoreContext } from "../../../contexts/StoreContext.jsx";
import { useAlert } from "../../../contexts/AlertContext.jsx";
import { deleteProductById } from "../../../services/api.js";

// Columnas de la tabla
const columns = [
  { name: "PRODUCTO", uid: "product", sortable: true },
  { name: "PRECIO", uid: "price", sortable: true },
  { name: "STOCK", uid: "stock", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "ETIQUETAS", uid: "tags" },
  { name: "ACCIONES", uid: "actions" },
];

// Opciones de estado para filtrar
const statusOptions = [
  { name: "En Venta", uid: "onSale" },
  { name: "Exposición", uid: "exhibition" },
  { name: "Deshabilitado", uid: "disabled" },
];

// Colores para los chips de estado
const statusColorMap = {
  onSale: "success",
  exhibition: "secondary",
  disabled: "default",
};

// Etiquetas de estado
const statusLabelMap = {
  onSale: "En Venta",
  exhibition: "Exposición",
  disabled: "Deshabilitado",
};

const INITIAL_VISIBLE_COLUMNS = [
  "product",
  "price",
  "stock",
  "status",
  "tags",
  "actions",
];

export default function AdminProductsListAux() {
  const navigate = useNavigate();
  const { user, sellerStore } = useOutletContext();
  const { storeProducts, setStoreProductsList } = useContext(StoreContext);
  const { addAlert } = useAlert();

  const [isLoading, setIsLoading] = useState(false);

  // Estados para filtros, ordenamiento y paginación
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "product",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const handleDelete = async (productId, userId) => {
    try {
      const deleteData = await deleteProductById(productId, userId);
      //console.log("Producto eliminado:", deleteData);
      addToast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
        color: "success",
      });
    } catch (err) {
      //console.error(err);
      addToast({
        title: "Error",
        description: err?.message || "Error al eliminar producto",
        color: "danger",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        // Refrescar lista de productos (storeProducts) sin recargar toda la página
        setStoreProductsList((prev) => prev.filter((p) => p._id !== productId));
      }, 500);
    }
  };

  // Determinar si hay filtro de búsqueda
  const hasSearchFilter = Boolean(filterValue);

  // Columnas visibles
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // Filtrar productos
  const filteredItems = useMemo(() => {
    let filteredProducts = [...(storeProducts || [])];

    // Filtro por texto de búsqueda
    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Filtro por estado
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredProducts = filteredProducts.filter((product) =>
        Array.from(statusFilter).includes(product.status)
      );
    }

    return filteredProducts;
  }, [storeProducts, filterValue, statusFilter]);

  // Calcular páginas
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // Items de la página actual
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // Ordenar items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let first, second;

      switch (sortDescriptor.column) {
        case "product":
          first = a.title;
          second = b.title;
          break;
        case "price":
          first = a.price;
          second = b.price;
          break;
        case "stock":
          first = a.stock || 0;
          second = b.stock || 0;
          break;
        case "status":
          first = a.status;
          second = b.status;
          break;
        default:
          first = a.title;
          second = b.title;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Renderizar celda
  const MAX_VISIBLE_CATEGORIES = 2;

  const renderCell = useCallback(
    (product, columnKey) => {
      switch (columnKey) {
        case "product": {
          const categories = Array.isArray(product.categories)
            ? product.categories
            : [];

          const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
          const hiddenCount = categories.length - visibleCategories.length;

          return (
            <User
              avatarProps={{
                radius: "lg",
                src: product.images?.[0]?.url,
                className: "w-12 h-12",
              }}
              name={product.title}
              description={
                categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-0">
                    {visibleCategories.map((cat) => (
                      <Chip
                        key={cat._id}
                        size="sm"
                        variant="flat"
                        className="text-xs bg-blue-100 text-blue-600"
                      >
                        {cat.name}
                      </Chip>
                    ))}

                    {hiddenCount > 0 && (
                      <Tooltip
                        content={categories.map((c) => c.name).join(" · ")}
                        placement="top"
                      >
                        <Chip
                          size="sm"
                          variant="flat"
                          className="text-xs cursor-pointer"
                        >
                          +{hiddenCount} más
                        </Chip>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Sin categoría</span>
                )
              }
            >
              {product.title}
            </User>
          );
        }

        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{product.price?.toFixed(2)} €</p>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <p className="text-xs text-gray-400 line-through">
                    {product.originalPrice?.toFixed(2)} €
                  </p>
                )}
            </div>
          );

        case "stock":
          return (
            <Chip
              className="capitalize"
              color={
                product.stock > 10
                  ? "success"
                  : product.stock > 0
                  ? "warning"
                  : "danger"
              }
              size="sm"
              variant="flat"
            >
              {product.stock ?? "N/A"}
            </Chip>
          );

        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[product.status] || "default"}
              size="sm"
              variant="flat"
              startContent={
                product.status === "onSale" ? (
                  <Store size={12} />
                ) : product.status === "exhibition" ? (
                  <Eye size={12} />
                ) : (
                  <EyeOff size={12} />
                )
              }
            >
              {statusLabelMap[product.status] || product.status}
            </Chip>
          );

        case "tags":
          return (
            <div className="flex gap-1 flex-wrap">
              {product.oferta && (
                <Chip
                  size="sm"
                  color="danger"
                  variant="flat"
                  startContent={<Tag size={10} />}
                >
                  Oferta
                </Chip>
              )}
              {product.destacado && (
                <Chip
                  size="sm"
                  color="warning"
                  variant="flat"
                  startContent={<Star size={10} />}
                >
                  Destacado
                </Chip>
              )}
              {!product.oferta && !product.destacado && (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </div>
          );

        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-2">
              <Tooltip content="Ver detalles">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() =>
                    navigate(
                      `/product/${sellerStore?.slug}/${product.slug}/${product._id}`
                    )
                  }
                >
                  <Eye size={18} className="text-default-400" />
                </Button>
              </Tooltip>
              <Tooltip content="Editar producto">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() =>
                    navigate(`/store-admin/productos/editar/${product._id}`)
                  }
                >
                  <Edit size={18} className="text-success" />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Eliminar producto">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => {
                    console.log(
                      `DELETE - Eliminar producto con id ${product._id}`
                    );
                    console.log(`DELETE - userId es ${user._id}`);
                    addAlert({
                      title: "Eliminar producto",
                      message: (
                        <span>
                          ¿Estás seguro de que deseas eliminar el producto
                          <strong> {`${product.title}`}</strong>?
                        </span>
                      ),
                      type: "danger",
                      confirmText: "Eliminar",
                      cancelText: "Cancelar",
                      onConfirm: async () => {
                        setIsLoading(true);
                        await handleDelete(product._id, user._id);
                      },
                    });
                  }}
                >
                  <Trash2 size={18} className="text-danger" />
                </Button>
              </Tooltip>
            </div>
          );

        default:
          return product[columnKey];
      }
    },
    [navigate]
  );

  // Handlers
  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Contenido superior (buscador, filtros, botón añadir)
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<Search size={18} className="text-default-300" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown size={16} />} variant="flat">
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown size={16} />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas visibles"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              as={Link}
              to="/store-admin/productos/nuevo"
              color="primary"
              endContent={<Plus size={16} />}
            >
              Añadir producto
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {storeProducts?.length || 0} productos
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    storeProducts?.length,
    rowsPerPage,
  ]);

  // Contenido inferior (paginación)
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  // Si no hay productos
  if (!storeProducts || storeProducts.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-xl font-semibold mb-2">Listado de Productos</h3>
        <p className="text-gray-700 mb-4">
          Estos son los productos que hay en la tienda:
        </p>
        <div className="flex flex-col items-center gap-4 py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">Aún no hay ningún producto.</p>
          <Button
            as={Link}
            to="/store-admin/productos/nuevo"
            color="primary"
            endContent={<Plus size={16} />}
          >
            Añadir el primer producto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <h3 className="text-xl font-semibold mb-2">Listado de Productos</h3>
      <p className="text-gray-700 mb-4">
        Estos son los productos que hay en la tienda:
      </p>

      <Table
        aria-label="Tabla de productos"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          table: "border-separate border-spacing-y-2 ",
          tr: "relative hover:shadow-lg hover:shadow-black/30 transition-all duration-300 ",
        }}
        //selectedKeys={selectedKeys}
        //selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        //onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
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
          emptyContent={"No se encontraron productos"}
          items={sortedItems}
        >
          {(item) => (
            <TableRow
              key={item._id}
              renderCell={renderCell}
              className="transition-all duration-300 ease-out !bg-gray-100/40 hover:!bg-gray-100 hover:shadow-md"
            >
              {(columnKey) => (
                <TableCell className="relative !first:rounded-l-xl !last:rounded-r-xl !overflow-hidden">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* overlay con spinner */}
      {isLoading && (
        <div className="absolute z-50 top-[-1rem] left-[-1rem] left-0 w-[calc(100%+2rem)] h-[calc(100%+2rem)] flex items-center justify-center bg-white/10 filter backdrop-blur-xs">
          <Spinner
            classNames={{ label: "text-foreground mt-3 text-sm" }}
            label="eliminando producto"
            labelColor="primary"
            variant="gradient"
            color="primary"
            size="lg"
          />
        </div>
      )}
    </div>
  );
}
