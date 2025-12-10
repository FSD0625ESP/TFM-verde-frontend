import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import Gallery from "../components/Gallery/Gallery";
import Filters from "../components/Filters/Filters";
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
import { ShoppingBag, Instagram, Facebook, Globe, User } from "lucide-react";
import {
  getStoreById,
  getAllProductsByStoreId,
  //getAllFeaturedProducts,
  getAllCategories,
  getStoreReviewsById,
  addStoreReview,
} from "../services/api";

import "./accordion.css";

import { AuthContext } from "../contexts/AuthContext";

export default function ProductDetailPage() {
  //obtenemos la id del producto de la url
  const { id: storeId } = useParams();

  const [store, setStore] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);
  const [areCategoriesFiltered, setAreCategoriesFiltered] = useState(false);
  const [productsListByStore, setProductsListByStore] = useState([]);
  const [storeReviews, setStoreReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const { user } = useContext(AuthContext);
  console.log("user id", user?._id);

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const fetchStore = async () => {
    try {
      const data = await getStoreById(storeId);
      setStore(data);
      console.log("fetchStore - store", data);
    } catch (error) {
      console.error("Error al obtener la tienda:", error);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      const data = await getAllProductsByStoreId(storeId);
      setProductsListByStore(data);
    } catch (error) {
      console.error("Error al obtener los productos de la tienda:", error);
    }
  };

  const fetchStoreReviews = async () => {
    try {
      const data = await getStoreReviewsById(storeId);
      setStoreReviews(data);
      console.log("storeReviews", data);
      setTotalReviews(data.length);
      setAverageRating(
        round(
          data.reduce((acc, review) => acc + review.rating, 0) / data.length,
          1
        )
      );
    } catch (error) {
      console.error("Error al obtener las reseñas de la tienda:", error);
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

  const fetchCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      const categoriesFromStore = store?.categories || [];
      const filteredCategories = allCategories.filter((category) =>
        productsListByStore.some((product) =>
          product.categories.includes(category._id)
        )
      );
      setCategoriesList(filteredCategories);
      setAreCategoriesFiltered(true);
      console.log("categoriesList filtered", filteredCategories);
      console.log("categoriesList from store", categoriesFromStore);
      console.log("categoriesList not filtered", allCategories);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    fetchStore();
    fetchStoreProducts();
    fetchStoreReviews();
    //fetchFeaturedProducts();
    console.log("useEffect launched");
  }, []);

  // Se ejecuta cuando store cambia y ya tiene datos
  useEffect(() => {
    if (store && store.categories) {
      fetchCategories();
    }
  }, [store]);

  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    userId: user?._id,
    storeId: store?._id,
    ratingValue: 0,
    comment: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: user?._id,
      storeId: store?._id,
    }));
  }, [user, store]);

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
      await addStoreReview({
        userId: formData.userId,
        storeId: formData.storeId,
        rating: formData.ratingValue,
        comment: formData.comment,
      });

      addToast({
        title: "Valoración enviada con éxito",
        description: "Gracias por valorar este producto.",
        color: "success",
        duration: 5000,
      });
      fetchStoreReviews();
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

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  useEffect(() => {
    if (productsListByStore && productsListByStore.length > 0) {
      const prices = productsListByStore.map((p) => p.price || 0);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
    }
  }, [productsListByStore]);

  return (
    <>
      <div className="w-full">
        <Slider items={[store]} type="store" numSlides={1} />
      </div>

      <section className="w-full bg-primary/10">
        <div className="container px-8 py-4 mx-auto">
          {store && (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-start justify-items-stretch gap-4 ">
              <div className="p-3 justify-self-center">
                <div className="flex flex-row items-center gap-2">
                  {averageRating > 0 && (
                    <Rating
                      initialValue={averageRating ? averageRating : 0}
                      readonly
                      size="lg"
                    />
                  )}
                  {averageRating && (
                    <span className="text-sm text-gray-600">
                      ({averageRating}) -{" "}
                      <a
                        href="#reviews-section"
                        className="underline hover:text-primary duration-300"
                      >
                        {totalReviews} reseñas
                      </a>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 justify-self-center">
                <div className="flex flex-row items-center gap-2">
                  <a
                    href={`https://www.instagram.com/${store?.socialLinks?.instagram}`}
                    target="_blank"
                  >
                    <Instagram
                      className="mr-1 text-primary hover:text-secondary cursor-pointer"
                      size="24px"
                      radius="lg"
                    />
                  </a>
                  <a
                    href={`https://www.facebook.com/${store?.socialLinks?.facebook}`}
                    target="_blank"
                  >
                    <Facebook
                      className="mr-1 text-primary hover:text-secondary cursor-pointer"
                      size="24px"
                      radius="lg"
                    />
                  </a>
                  <a
                    href={`https://${store?.socialLinks?.web}`}
                    target="_blank"
                  >
                    <Globe
                      className="mr-1 text-primary hover:text-secondary cursor-pointer"
                      size="24px"
                      radius="lg"
                    />
                  </a>
                </div>
              </div>

              <div className="p-3 justify-self-center">
                <div className="flex flex-row items-center gap-2">
                  {averageRating > 0 && (
                    <Rating
                      initialValue={averageRating ? averageRating : 0}
                      readonly
                      size="lg"
                    />
                  )}
                  {averageRating && (
                    <span className="text-sm text-gray-600">
                      ({averageRating}) -{" "}
                      <a
                        href="#reviews"
                        className="underline hover:text-primary duration-300"
                      >
                        {totalReviews} reseñas
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {areCategoriesFiltered && (
        <>
          {console.log("categoriesList", categoriesList)}
          <Filters
            categoriesList={categoriesList}
            storesList={[store]}
            initialMinPrice={minPrice}
            initialMaxPrice={maxPrice}
            mode="products"
            showTabs={false}
          />
        </>
      )}

      <section className="w-full max-w-[1536px] px-8 py-4 mx-auto">
        {store && (
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
                  Incidunt eveniet expedita voluptatem facere unde itaque odit
                  commodi praesentium? Amet sed suscipit culpa in commodi maxime
                  consequuntur adipisci, ratione nulla quae?
                </p>
              </AccordionItem>
              <AccordionItem
                key="3"
                aria-label="Condiciones de envío"
                title="Condiciones de envío"
                className="border-b-1 border-gray-300"
              >
                <p className="pb-4">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Incidunt eveniet expedita voluptatem facere unde itaque odit
                  commodi praesentium? Amet sed suscipit culpa in commodi maxime
                  consequuntur adipisci, ratione nulla quae?
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <div
          id="reviews-section"
          className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 "
        >
          <h2 className="text-2xl font-semibold pt-10 col-span-2">
            Reseñas de la tienda
          </h2>
          <div className="flex flex-col p-3">
            <div className="w-full pt-6 flex flex-col gap-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-start items-end gap-3"
                >
                  <Rating initialValue={5 - index} readonly size="lg" />
                  <span className="text-sm text-gray-600">
                    {
                      storeReviews.filter(
                        (review) => review.rating === 5 - index
                      ).length
                    }{" "}
                    reseñas
                  </span>
                </div>
              ))}
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

          <div className="flex flex-col p-3">
            {storeReviews.map((review) => (
              <div key={review.id} className="pt-8">
                <div className="flex flex-col gap-2">
                  <Rating initialValue={review.rating} readonly size="lg" />
                  {review.userId && (
                    <p className="text-gray-600">
                      <span className="font-bold">
                        {review.userId.firstName} {review.userId.lastName}
                      </span>
                      {" - "}
                      {format(parseISO(review.createdAt), "dd-MM-yyyy")}
                    </p>
                  )}
                  <span className="text-gray-600">{review.comment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
