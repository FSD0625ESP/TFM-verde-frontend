import { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import Gallery from "../components/Gallery/Gallery";
import {
  Button,
  Accordion,
  AccordionItem,
  Textarea,
  addToast,
} from "@heroui/react";
import ListElement from "../components/ListElement/ListElement";
import Rating from "../components/Rating/Rating";
import { format, parseISO } from "date-fns";
import { ShoppingBag, User } from "lucide-react";
import {
  getProductById,
  getAllProducts,
  //getAllFeaturedProducts,
  getAllCategories,
  getProductReviewsById,
  addProductReview,
} from "../services/api";

import "./accordion.css";

import { AuthContext } from "../contexts/AuthContext";

export default function ProductDetailPage() {
  //obtenemos la id del producto de la url
  const { id: productId } = useParams();
  const ratingRef = useRef(null);

  const [product, setProduct] = useState({});
  const [productReviews, setProductReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const { user } = useContext(AuthContext);

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

  /*
  const [featuredProductsList, setFeaturedProductsList] = useState([]);
  const fetchFeaturedProducts = async () => {
    try {
      const data = await getAllFeaturedProducts();
      setFeaturedProductsList(data);
    } catch (error) {
      console.error("Error al obtener los productos destacados:", error);
    }
  };
*/

  const [categoriesList, setCategoriesList] = useState([]);
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchProducts();
    fetchProductReviews();
    //fetchFeaturedProducts();
    fetchCategories();
    console.log("useEffect launched");
  }, []);

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
    console.log("comment", value);
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
  console.log("Average rating:", averageRating);
  return (
    <>
      <section className="max-w-[1536px] grid px-8 py-8 mx-auto">
        {product && (
          /*<div className=" flex flex-row flex-grow flex-1 gap-4 items-start position-relative">*/
          <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4 position-relative">
            <div className="gallery md:sticky md:top-[100px] bg-primary/10 p-3 rounded-lg">
              {product.images && <Gallery images={product.images} />}
            </div>

            <div className="w-full flex flex-col p-3">
              <div className="w-full flex flex-row gap-2">
                {averageRating > 0 && (
                  <Rating
                    initialValue={averageRating ? averageRating : 0}
                    readonly
                    size="lg"
                  />
                )}
                {averageRating && (
                  <span className="text-sm text-gray-600">
                    Valoraciones: ({averageRating}) -{" "}
                    <a
                      href="#reviews"
                      className="underline hover:text-primary duration-300"
                      onClick={() => {
                        // abrir el desplegable si no esta abierto de las reseñas
                        ratingRef.current?.scrollIntoView({ behavior: "smooth" });
                        // simular click en el accordion si no esta abierto sabiendo que current es null
                        ratingRef.current?.click()
                      }}
                    >
                      {totalReviews} reseñas
                    </a>
                  </span>
                )}
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
              <div className="flex flex-row items-end gap-2 py-2">
                <span className="text-sm text-black font-semibold text-xl">
                  {product.price}$
                </span>
                <span className="text-sm text-gray-600">
                  {product.stock > 0
                    ? ` (en stock: ${product.stock}u)`
                    : "Agotado"}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                <Button color="primary" radius="lg" size="lg">
                  COMPRAR
                  <ShoppingBag className="mr-2" />
                </Button>
              </div>
              <div className="w-full">
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
                    <p className="pb-4">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Incidunt eveniet expedita voluptatem facere unde itaque
                      odit commodi praesentium? Amet sed suscipit culpa in
                      commodi maxime consequuntur adipisci, ratione nulla quae?
                    </p>
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
              {user && (
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
    </>
  );
}
