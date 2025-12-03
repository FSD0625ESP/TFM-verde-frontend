import React from "react";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Input,
  Slider as PriceSlider,
  Select,
  SelectItem,
} from "@heroui/react";

export default function FiltersBar({
  mode,
  storesList,
  categoriesList,
  // Product Filter State & Handlers
  tempStores,
  setTempStores,
  tempProductCategories,
  setTempProductCategories,
  tempMin,
  tempMax,
  handlePriceChange,
  tempOffer,
  handleOfferChange,
  loadingProducts,
  applyProductFilters,
  // Store Filter State & Handlers
  tempStoreCategories,
  setTempStoreCategories,
  storeCategoriesInputValue,
  setStoreCategoriesInputValue,
  loadingStores,
  applyStoreFilters,
  minPrice = 0,
  maxPrice = 500,
  searchStoreInputValue = "",
  setSearchStoreInputValue,
}) {

  const renderProductFilters = () => (
    <Card className="shadow-sm border-1 border-gray-200 sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">
      <CardBody className="p-4 flex flex-col flex-1 overflow-y-auto">
        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-800">Filtros</h3>
        </div>

        {/* Contenido */}
        <div className="space-y-6 flex-1">
          <Input
            placeholder="Busca Productos"
            value={searchStoreInputValue}
            onChange={(e) => setSearchStoreInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyProductFilters();
              }
            }}
            isClearable
            onClear={() => setSearchStoreInputValue("")}
            className="mb-3"
          />
          {storesList && storesList.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tiendas
              </label>
              <Select
                items={storesList}
                selectedKeys={new Set(tempStores)}
                onSelectionChange={(keys) => {
                  setTempStores(Array.from(keys));
                }}
                label="Selecciona tiendas"
                placeholder="Busca o selecciona..."
                selectionMode="multiple"
                className="w-full"
                size="sm"
                isClearable
              >
                {(store) => (
                  <SelectItem key={store._id} value={store._id}>
                    {store.name}
                  </SelectItem>
                )}
              </Select>
            </div>
          )}
          <div className="space-y-2 pt-1">
            <label className="text-sm font-semibold text-gray-700">
              Oferta
            </label>
            <Button
              className={`w-full ${tempOffer ? "bg-secondary text-white" : "bg-primary/20"
                }`}
              onPress={handleOfferChange}
            >
              En oferta
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Categorías
            </label>
            <Select
              items={categoriesList}
              selectedKeys={new Set(tempProductCategories)}
              onSelectionChange={(keys) => {
                setTempProductCategories(Array.from(keys));
              }}
              label="Selecciona categorías"
              placeholder="Busca o selecciona..."
              selectionMode="multiple"
              className="w-full"
              size="sm"
              isClearable
            >
              {(category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              )}
            </Select>
          </div>

          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-semibold text-gray-700">
              Rango de Precio
            </label>
            <div className="px-2">
              <PriceSlider
                label="Precio"
                step={1}
                maxValue={maxPrice}
                minValue={minPrice}
                value={[tempMin, tempMax]}
                onChange={handlePriceChange}
                className="max-w-md"
                color="primary"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>€{tempMin}</span>
              <span>€{tempMax}</span>
            </div>
          </div>


        </div>

        {/* Botón */}
        <div className="border-t pt-4 mt-4 flex-shrink-0">
          <Button
            fullWidth
            color="primary"
            className="bg-primary text-white"
            onClick={applyProductFilters}
            isDisabled={loadingProducts}
          >
            {loadingProducts ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Aplicando...
              </>
            ) : (
              "Aplicar Filtros"
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  const renderStoreFilters = () => (
    <Card className="shadow-sm border-1 border-gray-200 sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">
      <CardBody className="p-4 flex flex-col flex-1 overflow-y-auto">
        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-800">Filtros</h3>
        </div>

        {/* Contenido */}
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <Input
              placeholder="Busca tiendas"
              value={searchStoreInputValue}
              onChange={(e) => {
                console.log(e.target.value);
                setSearchStoreInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyStoreFilters();
                }
              }}
              isClearable
              onClear={() => setSearchStoreInputValue("")}
              className="mb-2"
            />
            <div className="border-t pt-4 mt-4"></div>
            <label className="text-sm font-semibold text-gray-700">
              Categorías
            </label>
            <Select
              items={categoriesList.filter((cat) =>
                cat.name.toLowerCase().includes(storeCategoriesInputValue.toLowerCase())
              )}
              selectedKeys={new Set(tempStoreCategories)}
              onSelectionChange={(keys) => {
                setTempStoreCategories(Array.from(keys));
              }}
              inputValue={storeCategoriesInputValue}
              onInputChange={setStoreCategoriesInputValue}
              label="Selecciona categorías"
              placeholder="Busca o selecciona..."
              selectionMode="multiple"
              className="w-full"
              size="sm"
              isClearable
            >
              {(category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>

        {/* Botón */}
        <div className="border-t pt-4 mt-4 flex-shrink-0">
          <Button
            fullWidth
            color="primary"
            className="bg-primary text-white"
            onClick={applyStoreFilters}
            isDisabled={loadingStores}
          >
            {loadingStores ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Aplicando...
              </>
            ) : (
              "Aplicar Filtros"
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  if (mode === 'products') {
    return renderProductFilters();
  } else if (mode === 'stores') {
    return renderStoreFilters();
  } else {
    return null;
  }
}
