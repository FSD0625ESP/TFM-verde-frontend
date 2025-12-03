import { useEffect, useState } from "react";
import { Spinner, Card, CardBody } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ListElement from "../ListElement/ListElement";
import { getRelatedProducts } from "../../services/api";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./RelatedProducts.css";

/**
 * Componente de Productos Relacionados
 * @param {String} productId - ID del producto actual
 * @param {Array} categories - Array de IDs de categorías del producto
 * @param {Number} limit - Cantidad de productos a mostrar (default: 8)
 */
export default function RelatedProducts({ productId, categories = [], limit = 8 }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getRelatedProducts(productId, categories, limit);
                setRelatedProducts(data || []);
            } catch (err) {
                console.error("Error al obtener productos relacionados:", err);
                setError("No se pudieron cargar los productos relacionados");
            } finally {
                setLoading(false);
            }
        };

        if (productId && categories && categories.length > 0) {
            fetchRelatedProducts();
        }
    }, [productId, categories, limit]);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <Spinner size="lg" />
                <span className="ml-3 text-lg">Cargando productos relacionados...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="shadow-sm border-1 border-gray-200">
                <CardBody className="p-8 text-center">
                    <p className="text-gray-500 text-lg">{error}</p>
                </CardBody>
            </Card>
        );
    }

    if (!relatedProducts || relatedProducts.length === 0) {
        return (
            <Card className="shadow-sm border-1 border-gray-200">
                <CardBody className="p-8 text-center">
                    <p className="text-gray-500 text-lg">
                        No hay productos relacionados disponibles
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="w-full py-8">
            <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={16}
                navigation={true}
                pagination={{
                    clickable: true,
                }}
                modules={[Navigation, Pagination]}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                    1280: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                }}
                className="related-products-swiper"
            >
                {relatedProducts.map((product) => (
                    <SwiperSlide key={product._id}>
                        <ListElement item={product} type="product" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
