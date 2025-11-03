import React from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";

const StoreListElement = ({ item }) => {
  return (
    <>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">New</p>
          <h4 className="text-black font-medium text-2xl">{item.name}</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src={item.logo}
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">{item.description}</p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Ver
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};


export default StoreListElement;
