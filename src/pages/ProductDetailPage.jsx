import { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Gallery from "../components/Gallery/Gallery";
import {
  Button,
  Accordion,
  AccordionItem,
  Textarea,
  addToast,
  Chip,
} from "@heroui/react";
import RelatedProducts from "../components/RelatedProducts/RelatedProducts";
import Rating from "../components/Rating/Rating";
import { format, parseISO } from "date-fns";
import { ShoppingBag, User } from "lucide-react";
import {
  getProductById,
  getAllProducts,
  //getAllFeaturedProducts,
  getAllCategories,
  getProductReviewsById,
  getStoreById,
  addProductReview,
} from "../services/api";
import AddToCartButton from "../components/Cart/AddToCartButton";

import "./accordion.css";

import { AuthContext } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";

import { trackAnalyticsEvent } from "../services/api";

export default function ProductDetailPage() {
  //obtenemos la id del producto de la url
  const { id: productId } = useParams();
  const ratingRef = useRef(null);

  const [product, setProduct] = useState({});
  const [productReviews, setProductReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingFormSent, setRatingFormSent] = useState(false);

  const { user } = useContext(AuthContext);

  const { socket, isConnected } = useSocket();
  const [viewersCount, setViewersCount] = useState(0);

  // Efecto para unirse al canal del producto (WEBSOCKET: emitir "join_product") y escuchar actualizaciones
  useEffect(() => {
    if (!socket || !isConnected || !productId) return;

    socket.emit("join_product", { productId });

    const handleUpdate = ({ productId: incomingId, count }) => {
      if (incomingId === productId) {
        setViewersCount(count);
      }
    };

    socket.on("product_viewers_update", handleUpdate);

    return () => {
      socket.emit("leave_product", { productId });
      socket.off("product_viewers_update", handleUpdate);
    };
  }, [socket, isConnected, productId]);

  // función para redondear a n decimales - usada para el cálculo de la valoración media
  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const fetchProduct = async () => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const data = await getProductReviewsById(productId);
      setProductReviews(data);
      setTotalReviews(data.length);
      if (data.length === 0) {
        setAverageRating(0);
        return;
      }
      setAverageRating(
        round(
          data.reduce((acc, review) => acc + review.rating, 0) / data.length,
          1
        )
      );
    } catch (error) {
      console.error("Error al obtener las reviews del producto:", error);
    }
  };

  const [productsList, setProductsList] = useState([]);
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProductsList(data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const [categoriesList, setCategoriesList] = useState([]);
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const [store, setStore] = useState({});
  const fetchStore = async () => {
    try {
      const data = await getStoreById(product?.storeId._id);
      setStore(data);
      console.log("fetchStore - store", data);
    } catch (error) {
      console.error("Error al obtener los datos de la tienda:", error);
    }
  };

  /* determinar si el usuario puede valorar el producto
    - debe estar logueado
    - NO debe ser el propietario de la tienda
  */
  const canReview =
    user && store?.ownerId && String(user._id) !== String(store.ownerId);

  useEffect(() => {
    fetchProduct();
    fetchProducts();
    fetchProductReviews();
    //fetchFeaturedProducts();
    fetchCategories();
    console.log("useEffect launched");
  }, [productId]);

  // Registrar visita al producto en analytics cuando el producto esté cargado
  useEffect(() => {
    if (product && product._id && product.storeId) {
      const storeId =
        typeof product.storeId === "object"
          ? product.storeId._id
          : product.storeId;
      console.log(
        "📊 Tracking view_product - storeId:",
        storeId,
        "productId:",
        product._id
      );
      trackAnalyticsEvent("view_product", storeId, product._id);
    }
  }, [product?._id]);

  useEffect(() => {
    if (product?.storeId?._id) {
      fetchProductReviews();
      fetchStore();
    }
  }, [product]);

  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    userId: user?._id,
    productId: product?._id,
    ratingValue: 0,
    comment: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: user?._id,
      productId: product?._id,
    }));
  }, [user, product]);

  const validateComment = (value) => {
    if (!value) {
      return "Debes escribir una valoración";
    }
    return true;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ratingValue || formData.ratingValue === 0) {
      console.log("es obligatorio seleccionar un valor");
      document.querySelector(".rating-error").style.display = "block";
      return;
    } else {
      document.querySelector(".rating-error").style.display = "none";
    }

    try {
      // envío de datos al backend
      await addProductReview({
        userId: formData.userId,
        productId: formData.productId,
        rating: formData.ratingValue,
        comment: formData.comment,
      });

      addToast({
        title: "Valoración enviada con éxito",
        description: "Gracias por valorar este producto.",
        color: "success",
        duration: 5000,
      });
      fetchProductReviews();
      // reset del formulario
      setRatingFormSent(true);
      setRating(0);
      setFormData((prev) => ({ ...prev, ratingValue: 0, comment: "" }));
      //bloquear el formulario para que no pueda valorar más de una vez
      e.target.querySelectorAll("input, textarea, button").forEach((el) => {
        el.disabled = true;
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error al enviar la valoración",
        description:
          error.response?.data?.msg || "Por favor, inténtalo de nuevo",
        color: "danger",
        duration: 5000,
      });
    }
  };
  return (
    <>
      <section className="container grid px-8 py-8 mx-auto">
        {product && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4 position-relative">
            <div className="gallery md:sticky md:top-[100px] bg-primary/10 p-3 rounded-lg">
              {product.images && <Gallery images={product.images} />}
            </div>

            <div className="w-full flex flex-col p-3">
              <div className="w-full flex flex-row gap-2">
                {totalReviews && totalReviews > 0 && (
                  <Rating
                    initialValue={averageRating ? averageRating : 0}
                    readonly
                    size="lg"
                  />
                )}
                <span className="text-sm text-gray-600 mt-0.5">
                  {averageRating ? (
                    <>
                      Valoración: {averageRating} -{" "}
                      <a
                        href="#reviews"
                        className="underline hover:text-primary duration-300"
                        onClick={() => {
                          // abrir el desplegable si no esta abierto de las reseñas
                          ratingRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                          // simular click en el accordion si no esta abierto sabiendo que current es null
                          ratingRef.current?.click();
                        }}
                      >
                        {totalReviews} reseñas
                      </a>
                    </>
                  ) : (
                    "Sin valoraciones"
                  )}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                <h2 className="text-3xl font-semibold">{product.title}</h2>
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                {product.storeId && (
                  <Link
                    to={`/store/${product.storeId.slug}/${product.storeId._id}`}
                    className="text-sm text-gray-600 underline hover:text-primary duration-300"
                  >
                    <h3 className="text-sm text-gray-600 hover:text-primary duration-300">
                      {product.storeId.name}
                    </h3>
                  </Link>
                )}
              </div>
              <p className="text-base text-gray-600">{product.description}</p>
              <div className="flex flex-row items-center gap-2 py-2">
                <span className="text-sm text-gray-600">Categoría:</span>
                {product.categories &&
                  product.categories.length > 0 &&
                  product.categories.map((cat) => (
                    <Chip
                      key={cat._id}
                      size="sm"
                      variant="flat"
                      color="primary"
                    >
                      {cat.name}
                    </Chip>
                  ))}
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                <span className="text-sm text-black font-semibold text-xl">
                  {product.price} €
                </span>
                <Chip
                  size="sm"
                  variant={product.stock > 4 ? "flat" : "solid"}
                  color={
                    product.stock > 0
                      ? product.stock > 4
                        ? "default"
                        : "warning"
                      : "danger"
                  }
                  className={`${product.stock > 4 ? "bg-white" : "text-white"}`}
                >
                  {product.stock > 0
                    ? ` ${
                        product.stock > 4
                          ? `${product.stock} unidades`
                          : "pocas unidades"
                      }`
                    : "Agotado"}
                </Chip>
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                <AddToCartButton productId={product._id}>
                  {" "}
                  <ShoppingBag className="mr-2" /> Comprar{" "}
                </AddToCartButton>
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                {viewersCount > 1 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <User size={16} />
                    {viewersCount - 1} personas viendo este producto ahora
                  </div>
                )}
              </div>
              <div className="w-full accordion-section">
                <Accordion
                  motionProps={{
                    variants: {
                      enter: {
                        y: 0,
                        opacity: 1,
                        height: "auto",
                        overflowY: "unset",
                        transition: {
                          height: {
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            duration: 1,
                          },
                          opacity: {
                            easings: "ease",
                            duration: 1,
                          },
                        },
                      },
                      exit: {
                        y: -10,
                        opacity: 0,
                        height: 0,
                        overflowY: "hidden",
                        transition: {
                          height: {
                            easings: "ease",
                            duration: 0.25,
                          },
                          opacity: {
                            easings: "ease",
                            duration: 0.3,
                          },
                        },
                      },
                    },
                  }}
                >
                  <AccordionItem
                    key="1"
                    aria-label="Descripción del producto"
                    title="Descripción del producto"
                    className="pt-6"
                  >
                    <p className="pb-4">{product.longDescription}</p>
                  </AccordionItem>
                  <AccordionItem
                    id="accordion-item-2"
                    key="2"
                    aria-label="Valoraciones y reseñas"
                    ref={ratingRef}
                    title="Valoraciones y reseñas"
                  >
                    <div
                      className="w-fullflex flex-col items-center gap-6 p-3"
                      id="reviews"
                    >
                      {productReviews.map((review) => (
                        <div key={review.id} className="pb-8">
                          <div className="flex flex-col gap-2">
                            <Rating
                              initialValue={review.rating}
                              readonly
                              size="lg"
                            />
                            {review.userId && (
                              <p className="text-gray-600">
                                <span className="font-bold">
                                  {review.userId.firstName}{" "}
                                  {review.userId.lastName}
                                </span>
                                {" - "}
                                {format(
                                  parseISO(review.createdAt),
                                  "dd-MM-yyyy"
                                )}
                              </p>
                            )}
                            <span className="text-gray-600">
                              {review.comment}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Condiciones de envío"
                    title="Condiciones de envío"
                    className="border-b-1 border-gray-300"
                  >
                    <p className="pb-4">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Incidunt eveniet expedita voluptatem facere unde itaque
                      odit commodi praesentium? Amet sed suscipit culpa in
                      commodi maxime consequuntur adipisci, ratione nulla quae?
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>
              {canReview && (
                <div className="w-full pt-8">
                  <form onSubmit={onSubmit} className="space-y-4 w-full">
                    <h3 className="text-lg font-semibold text-gray-700 mb-5">
                      Valora este producto
                    </h3>
                    <Rating
                      initialValue={0}
                      onRatingChange={(value) => {
                        setRating(value);
                        setFormData((prev) => ({
                          ...prev,
                          ratingValue: value,
                        }));
                      }}
                      size="lg"
                      readonly={ratingFormSent}
                    />
                    <p className="rating-error text-tiny text-danger mb-5 -mt-3 hidden">
                      Es obligatorio seleccionar una puntuación
                    </p>
                    <Textarea
                      label="Valoración"
                      placeholder="Escribe tu valoración..."
                      value={formData.comment}
                      onChange={handleInputChange("comment")}
                      validate={validateComment}
                      isRequired
                      variant="flat"
                      classNames={{
                        inputWrapper:
                          "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
                        input: "bg-white",
                      }}
                    />
                    <Button
                      type="submit"
                      color="primary"
                      radius="lg"
                      size="lg"
                      className="w-full"
                      isDisabled={ratingFormSent}
                    >
                      Enviar
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {product.categories && product.categories.length > 0 && (
        <section className="w-full bg-gray-50 py-8 mt-8  mx-auto">
          <div className="container  px-8 mx-auto overflow-hidden">
            <RelatedProducts
              productId={productId}
              categories={product.categories.map((cat) => cat._id || cat)}
              limit={8}
            />
          </div>
        </section>
      )}
    </>
  );
}
