import React from "react";
import "./ListElement.css";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import { ShoppingBag } from "lucide-react";

const ListElement = ({ item, type }) => {
  return (
    <>
      <Card
        key={item._id}
        isFooterBlurred
        radius="sm"
        /* isPressable */
        className="element-card w-full h-[300px] col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <h4 className="card-title text-black font-medium text-2xl pb-2">
            {item.name}
          </h4>
          <p className="card-tag text-tiny text-white bg-primary uppercase font-bold">
            New
          </p>
        </CardHeader>
        {type === "product" && (
          <div className="store-logo">
            <Image
              removeWrapper
              alt={item.storeId.name}
              className="w-full h-full object-cover"
              src={item.storeId.logo}
            />
          </div>
        )}

        <div className="img-overlay"></div>

        <a
          href={
            type === "product"
              ? `/product/${item.storeId.slug}/${item.slug}/${item._id}`
              : `/store/${item.slug}/${item._id}`
          }
        >
          <Image
            removeWrapper
            alt="Card example background"
            className="element-img z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src={`${type === "store" ? item.image : item.images[0]}`}
          />
        </a>
        <CardFooter className="element-footer absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between overflow-hidden">
          <div style={{ paddingRight: "1rem" }}>
            <p className="element-description text-black/100 text-tiny">
              {item.description}
              <span className="font-bold">
                {type === "product" ? ` - ${item.price}€` : null}
              </span>
            </p>
          </div>
          {type === "product" ? (
            <a href={`/product/${item.storeId.slug}/${item.slug}/${item._id}`}>
              <Button
                className="text-tiny text-white"
                color="primary"
                radius="sm"
                size="md"
                shadow="sm"
              >
                <ShoppingBag />
              </Button>
            </a>
          ) : (
            <a href={`/store/${item.slug}/${item._id}`}>
              <Button
                className="text-tiny text-white"
                color="primary"
                radius="sm"
                size="md"
                shadow="sm"
              >
                VER
              </Button>
            </a>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ListElement;
