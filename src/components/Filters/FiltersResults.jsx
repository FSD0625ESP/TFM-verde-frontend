import React from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import ListElement from "../ListElement/ListElement";

export default function FiltersResults({
  type, // 'product' | 'store'
  items,
  loading,
  initialLoading,
  hasMore,
  loaderRef,
  containerRef,
}) {
  const isProduct = type === "product";
  const emptyMessage = isProduct
    ? "No se encontraron productos"
    : "No se encontraron tiendas";
  const loadingMessage = isProduct
    ? "Cargando productos..."
    : "Cargando tiendas...";

  return (
    <div ref={containerRef} className="lg:col-span-3 w-full">
      {initialLoading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Spinner size="lg" />
          <span className="text-lg">{loadingMessage}</span>
        </div>
      ) : items.length === 0 ? (
        <Card className="shadow-sm border-1 border-gray-200">
          <CardBody className="p-8 text-center">
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
            <p className="text-gray-400 text-sm mt-2">
              Intenta con otros filtros
            </p>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ListElement key={item._id} item={item} type={type} />
            ))}
          </div>

          {loading && (
            <div className="col-span-full flex items-center justify-center gap-2 py-8">
              <Spinner size="lg" />
              <span className="text-lg">{loadingMessage}</span>
            </div>
          )}

          {!loading && !hasMore && items.length > 0 && (
            <div className="col-span-full flex items-center justify-center py-8">
              <p className="text-gray-500 text-center">No hay más resultados</p>
            </div>
          )}

          <div ref={loaderRef} className="h-1" />
        </>
      )}
    </div>
  );
}
