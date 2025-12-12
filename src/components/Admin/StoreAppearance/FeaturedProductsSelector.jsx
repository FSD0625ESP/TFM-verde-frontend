import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Chip,
    ScrollShadow,
} from "@heroui/react";
import { Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useMemo } from "react";
import { StoreContext } from "../../../contexts/StoreContext.jsx";
import ListElement from "../../ListElement/ListElement";
import * as api from "../../../services/api";

export default function FeaturedProductsSelector() {
    const { storeProducts, updateProduct } = useContext(StoreContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [isUpdating, setIsUpdating] = useState(null);

    // Usamos el campo "destacado" existente en los productos
    const featuredProducts = storeProducts.filter((p) => p.destacado === true);

    // Filtrar productos según búsqueda
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return storeProducts;
        const lowerSearch = searchTerm.toLowerCase();
        return storeProducts.filter(
            (product) =>
                product.title?.toLowerCase().includes(lowerSearch) ||
                product.description?.toLowerCase().includes(lowerSearch)
        );
    }, [storeProducts, searchTerm]);

    const handleToggleFeatured = async (product) => {
        try {
            setIsUpdating(product._id);
            const newFeaturedState = !product.destacado;

            await api.toggleProductFeatured(product._id, newFeaturedState);

            // Actualizar el producto en el context
            updateProduct(product._id, { destacado: newFeaturedState });
            console.log(`Producto ${product._id} ahora está ${newFeaturedState ? "destacado" : "no destacado"}`);
        } catch (error) {
            console.error("Error actualizando destacado:", error);
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Contador de destacados */}
            {featuredProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                >
                    <Card className="bg-primary-50 border border-primary-200">
                        <CardBody className="py-2 px-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-primary-800">
                                    {featuredProducts.length} producto{featuredProducts.length !== 1 ? "s" : ""} destacado{featuredProducts.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            )}
            {/* Buscador */}
            <Input
                isClearable
                placeholder="Buscar productos..."
                startContent={<Search size={18} className="text-gray-400" />}
                value={searchTerm}
                onValueChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
                className="w-full"
            />



            {/* Lista de productos */}
            {filteredProducts.length > 0 ? (
                <div className="w-full max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-3"
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product) => {
                                const isFeatured = product.destacado === true;

                                return (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card
                                            className={`transition-all cursor-pointer w-full ${isFeatured
                                                ? "border-2 border-primary-400 bg-primary-50/50 shadow-md"
                                                : "border border-gray-200 hover:border-primary-200"
                                                }`}
                                            isPressable
                                            isDisabled={isUpdating === product._id}
                                            onPress={() => handleToggleFeatured(product)}
                                        >
                                            <CardBody className="p-4 flex flex-row gap-4 items-stretch">
                                                {/* Imagen pequeña */}
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                    {product.images?.[0] && (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}

                                                    {/* Badge oferta */}
                                                    {product.oferta && (
                                                        <div className="absolute top-2 left-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded">
                                                            OFERTA
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Información del producto */}
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div>
                                                        <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                                                            {product.title}
                                                        </h4>
                                                        {product.description && (
                                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Precio y estado */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    {product.price && (
                                                        <span className="font-bold text-primary text-sm">
                                                            €{Number(product.price).toFixed(2)}
                                                        </span>
                                                    )}

                                                    {isFeatured ? (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="bg-primary text-white rounded-full p-1.5"
                                                        >
                                                            <Check size={16} />
                                                        </motion.div>
                                                    ) : (
                                                        <Chip
                                                            size="sm"
                                                            variant="flat"
                                                            color="default"
                                                        >
                                                            Agregar
                                                        </Chip>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            ) : (
                <Card className="bg-gray-50">
                    <CardBody className="py-8 text-center">
                        <p className="text-gray-600">
                            {searchTerm
                                ? "No se encontraron productos"
                                : "No hay productos disponibles"}
                        </p>
                    </CardBody>
                </Card>
            )}
        </motion.div>
    );
}
