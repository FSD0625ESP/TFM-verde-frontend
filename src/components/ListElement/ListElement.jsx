import React from "react";
import "./ListElement.css";
import {
  Card,
  CardBody,
  Image,
  Button,
  Chip,
  Badge,
  Tooltip,
} from "@heroui/react";
import { MapPin, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMagneticBorder } from "../../hooks/useMagneticBorder";
import AddToCartButton from "../Cart/AddToCartButton";

// type: "product" | "store"
// Para productos conserva:
//  - Badge "New" arriba izquierda
//  - Logo de la tienda arriba derecha
//  - Navegación a /product-detail/:id
// Para tiendas:
//  - Usa el diseño de tarjetas de tiendas de Resultados

const ListElement = ({ item, type, showLogo = false }) => {
  const navigate = useNavigate();
  const isProduct = type === "product";
  const borderRef = useMagneticBorder();

  const handleClick = (dontNavigate = false) => {
    if (dontNavigate) return;
    if (isProduct) {
      const storeName = item.storeId?.slug;
      const productName = item.slug;
      console.log("Navigating to product:", `/product/${storeName}/${productName}/${item._id}`);
      navigate(
        `/product/${encodeURIComponent(storeName)}/${encodeURIComponent(
          productName
        )}/${item._id}`
      );
    } else {
      const storeName = item.slug || "tienda";
      navigate(`/store/${encodeURIComponent(storeName)}/${item._id}`);
    }
  };

  if (isProduct) {
    const now = new Date();
    const createdAt = new Date(item.createdAt);
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let isNew = diffDays <= 10; // Consider a product new if it was created within the last 30 days

    return (
      <Card
        className="element-card relative shadow-sm border-1 max-w-[400px]  border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
        isPressable={true}
        onClick={() => handleClick()}
      >
        {/* Imagen principal */}
        <div ref={borderRef} className="magnetic-border" />
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={item.images?.[0].url || "/placeholder.png"}
            alt={item.title || item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            radius="none"
          />

          {isNew && (
            <>
              <p className="card-tag text-xs text-white bg-danger uppercase font-bold absolute z-10 top-2 left-2">
                New
              </p>
            </>
          )}
          {item.storeId?.logo && showLogo && (
            <div className="store-logo">
              <Image
                removeWrapper
                alt={item.storeId?.name}
                className="w-full h-full "
                src={item.storeId.logo}
              />
            </div>
          )}

          {/* Badges oferta/destacado si existen */}
          {item.oferta && (
            <Badge
              content="OFERTA"
              color="danger"
              className="absolute top-2 right-2"
            />
          )}
          {item.destacado && (
            <Badge
              content="⭐ DESTACADO"
              className="absolute bottom-2 left-2 bg-yellow-500"
            />
          )}
        </div>

        <CardBody className="p-4 space-y-2 bg-white">
          <h4 className="font-semibold text-gray-800 line-clamp-2">
            {item.title || item.name}
          </h4>

          {/* Descripción con tooltip para ver el texto completo */}
          <Tooltip
            content={item.description}
            color="foreground"
            placement="top"
            delay={300}
          >
            <p className="text-sm text-gray-600 line-clamp-2 cursor-help min-h-10">
              {item.description}
            </p>
          </Tooltip>

          {/* Categorías del producto (si existen) */}
          {item.categories && item.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 py-1">
              {item.categories.slice(0, 2).map((cat) => (
                <Chip
                  key={cat._id || cat.name}
                  size="sm"
                  variant="flat"
                  color="primary"
                >
                  {cat.name}
                </Chip>
              ))}
              {item.categories.length > 2 && (
                <Tooltip
                  color="foreground"
                  content={
                    <div className="flex flex-col gap-1">
                      {item.categories.slice(2).map((cat) => (
                        <span key={cat._id || cat.name}>{cat.name}</span>
                      ))}
                    </div>
                  }
                  placement="top"
                  delay={300}
                >
                  <Chip size="sm" variant="flat" className="cursor-help">
                    +{item.categories.length - 2}
                  </Chip>
                </Tooltip>
              )}
            </div>
          )}

          {/* Tienda */}
          {item.storeId && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span className="truncate">{item.storeId?.name}</span>
            </div>
          )}

          {/* Precio + botón */}
          <div className="flex items-center justify-between pt-2 border-t">
            {item.price && (
              <span className="text-lg font-bold text-primary-600">
                €{Number(item.price).toFixed(2)}
              </span>
            )}

            <AddToCartButton
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative z-10"
              productId={item._id} quantity={1} showQuantity={false} buttonText="Comprar" />

          </div>
        </CardBody>
      </Card>
    );
  }

  // Tarjeta de tienda (diseño ResultsPage)
  return (
    <Card
      className="element-card relative shadow-sm border-1 border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      {/* Imagen principal */}
      <div ref={borderRef} className="magnetic-border" />
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-100"
            radius="none"
            removeWrapper
          />
        ) : item.logo ? (
          <Image
            src={item.logo}
            alt={item.name}
            className="w-full h-full  group-hover:scale-105 transition-transform"
            radius="none"
          />
        ) : (
          <Home size={64} className="text-gray-300" />
        )}
        {item.logo && showLogo && (
          <div className="store-logo">
            <Image
              removeWrapper
              alt={item.name}
              className="w-full h-full  opacity-100"
              src={item.logo}
            />
          </div>
        )}
      </div>

      <CardBody className="p-4 space-y-2 bg-white">
        <h4 className="font-semibold text-gray-800 line-clamp-2">
          {item.name}
        </h4>

        {/* Descripción con tooltip para ver el texto completo */}
        <Tooltip
          content={item.description}
          color="foreground"
          placement="top"
          delay={300}
        >
          <p className="text-sm text-gray-600 line-clamp-2 cursor-help">
            {item.description}
          </p>
        </Tooltip>

        {/* Categorías (si existen, como en ResultsPage) */}
        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 py-2">
            {item.categories.slice(0, 2).map((cat) => (
              <Chip
                key={cat._id || cat.name}
                size="sm"
                variant="flat"
                color="primary"
                className="opacity-100"
              >
                {cat.name}
              </Chip>
            ))}
            {item.categories.length > 2 && (
              <Tooltip
                content={
                  <div className="flex flex-col gap-1">
                    {item.categories.slice(2).map((cat) => (
                      <span key={cat._id || cat.name}>{cat.name}</span>
                    ))}
                  </div>
                }
                placement="top"
                delay={300}
              >
                <Chip size="sm" variant="flat" className="cursor-help">
                  +{item.categories.length - 2}
                </Chip>
              </Tooltip>
            )}
          </div>
        )}

        {/* Dueño (si existe, como en ResultsPage) */}
        {item.ownerId && (
          <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-2">
            <span className="truncate">
              por {item.ownerId?.firstName} {item.ownerId?.lastName}
            </span>
          </div>
        )}

        <Button
          fullWidth
          size="sm"
          color="primary"
          className="mt-2 bg-primary text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Visitar tienda
        </Button>
      </CardBody>
    </Card>
  );
};

export default ListElement;
