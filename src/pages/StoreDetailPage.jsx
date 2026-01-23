import { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SliderStorePage from "../components/Slider/SliderStorePage";
import ListItemSlider from "../components/Slider/ListItemSlider";
import Filters from "../components/Filters/Filters";
import {
  Button,
  Accordion,
  AccordionItem,
  Textarea,
  addToast,
  Card,
  CardBody,
} from "@heroui/react";
import Rating from "../components/Rating/Rating";
import { format, parseISO } from "date-fns";
import { ShoppingBag, Instagram, Facebook, Globe, User } from "lucide-react";
import {
  getStoreById,
  getAllProductsByStoreId,
  getAllCategories,
  getStoreReviewsById,
  addStoreReview,
  getStoreAppearance,
  getStoreFeaturedProducts,
  getStoreOfferProducts,
  trackAnalyticsEvent,
} from "../services/api";

import "./accordion.css";

import { AuthContext } from "../contexts/AuthContext";
import StartChatButton from "../components/Chat/StartChatButton";
import ReportStoreButton from "../components/utils/ReportStoreButton";

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
  const [ratingFilter, setRatingFilter] = useState(null); // null = sin filtro, 1..5 = estrellas
  const [storeAppearance, setStoreAppearance] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);

  const { user } = useContext(AuthContext);

  // determinar si el usuario es el propietario de la tienda
  const isStoreOwner =
    user && store?.ownerId && String(user._id) === String(store.ownerId);

  // determinar si el usuario puede ver el contenido de la tienda
  const canSeeStoreContent =
    store?.active === true || (store?.active === false && isStoreOwner);

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const fetchStore = useCallback(async () => {
    try {
      const data = await getStoreById(storeId);
      setStore(data);
    } catch (error) {
      console.error("Error al obtener la tienda:", error);
    }
  }, [storeId]);

  const fetchStoreProducts = useCallback(async () => {
    try {
      const data = await getAllProductsByStoreId(storeId);
      setProductsListByStore(data);
    } catch (error) {
      console.error("Error al obtener los productos de la tienda:", error);
    }
  }, [storeId]);

  const fetchStoreReviews = useCallback(async () => {
    try {
      const data = await getStoreReviewsById(storeId);
      setStoreReviews(data);
      setTotalReviews(data.length);
      setAverageRating(
        round(
          data.reduce((acc, review) => acc + review.rating, 0) / data.length,
          1,
        ),
      );
    } catch (error) {
      console.error("Error al obtener las reseñas de la tienda:", error);
    }
  }, [storeId]);

  const fetchStoreAppearance = useCallback(async () => {
    try {
      const data = await getStoreAppearance(storeId);
      setStoreAppearance(data);
    } catch (error) {
      console.error("Error al obtener la apariencia de la tienda:", error);
    }
  }, [storeId]);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const data = await getStoreFeaturedProducts(storeId);
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
    }
  }, [storeId]);

  const fetchOfferProducts = useCallback(async () => {
    try {
      const data = await getStoreOfferProducts(storeId);
      setOfferProducts(data.products || []);
    } catch (error) {
      console.error("Error al obtener productos en oferta:", error);
    }
  }, [storeId]);

  useEffect(() => {
    fetchStore();
    fetchStoreProducts();
    fetchStoreReviews();
    fetchStoreAppearance();
    fetchFeaturedProducts();
    fetchOfferProducts();

    // Registrar visita a la tienda en analytics
    if (storeId) {
      trackAnalyticsEvent("view_store", storeId);
    }
  }, [
    storeId,
    fetchStore,
    fetchStoreProducts,
    fetchStoreReviews,
    fetchStoreAppearance,
    fetchFeaturedProducts,
    fetchOfferProducts,
  ]);

  // Se ejecuta cuando store cambia y ya tiene datos
  useEffect(() => {
    if (productsListByStore.length === 0) return;

    let isMounted = true;
    (async () => {
      try {
        const allCategories = await getAllCategories();

        const productCategoryIds = new Set(
          productsListByStore
            .flatMap((product) => product?.categories || [])
            .map((c) => {
              if (!c) return null;
              if (typeof c === "string") return c;
              if (typeof c === "object" && c._id) return c._id;
              return c;
            })
            .filter(Boolean)
            .map((id) => String(id)),
        );

        const filteredCategories = allCategories.filter((category) =>
          productCategoryIds.has(String(category?._id)),
        );

        if (!isMounted) return;
        setCategoriesList(filteredCategories);
        setAreCategoriesFiltered(true);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [productsListByStore]);

  const [_rating, setRating] = useState(0);
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
        description: "Gracias por valorar esta tienda.",
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

  // Filtrado de reseñas por rating
  const filteredReviews =
    ratingFilter === null
      ? storeReviews
      : storeReviews.filter((review) => review.rating === ratingFilter);

  // Animación de las reseñas al filtrar por rating
  const reviewVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      {isStoreOwner && store?.active === false && (
        <div className="bg-warning-100 border border-warning-300 text-warning-800 px-6 py-4 rounded-md my-6 text-center">
          ⚠️ <strong>Tienda inactiva</strong> — solo tú puedes ver esta tienda y
          sus productos hasta que vuelva a activarse.
        </div>
      )}

      {canSeeStoreContent && (
        <>
          {/* SECCIÓN DE SLIDER PERSONALIZADO */}
          {storeAppearance?.appearance.showSlider &&
            storeAppearance?.appearance.sliderImages &&
            storeAppearance.appearance.sliderImages.length > 0 && (
              <div className="w-full shadow-md">
                <SliderStorePage
                  images={storeAppearance.appearance.sliderImages}
                  storeName={store.name}
                  storeDescription={store.description}
                  storeLogo={store.logo}
                />
              </div>
            )}
          <div className="container px-8 py-4 mx-auto">
            {store && (
              <motion.div
                className="container grid grid-cols-1 md:grid-cols-3 items-start justify-items-stretch gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
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

                <div className="p-1 justify-self-center">
                  <div className="flex flex-row items-center gap-2">
                    <StartChatButton
                      storeId={store._id}
                      storeName={store.name}
                    />
                    <ReportStoreButton
                      storeId={store._id}
                      storeName={store.name}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          {(() => {
            const sectionsOrder = Array.isArray(
              storeAppearance?.appearance?.sectionsOrder,
            )
              ? storeAppearance.appearance.sectionsOrder
              : ["featured", "offers"];

            const featuredSection =
              storeAppearance?.appearance.showFeaturedSection &&
              featuredProducts.length > 0 ? (
                <motion.section
                  className="w-full py-12 shadow-sm"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="container px-8 mx-auto">
                    <div className="mb-8">
                      <motion.h2
                        className="text-3xl font-bold text-gray-800 mb-2 text-center text-shadow-md"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        Productos Destacados
                      </motion.h2>
                      <motion.p
                        className="text-gray-600 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        Descubre nuestros mejores productos
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <ListItemSlider
                        items={featuredProducts}
                        type="product"
                        breakpoints={{
                          320: 1,
                          640: 2,
                          840: 3,
                          1024: 4,
                          1200: 4,
                          1400: 4,
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.section>
              ) : null;

            const offersSection =
              storeAppearance?.appearance.showOfferSection &&
              offerProducts.length > 0 ? (
                <motion.section
                  className="w-full py-12 bg-danger-50/30 shadow-sm"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="container px-8 mx-auto">
                    <div className="mb-8">
                      <motion.h2
                        className="text-3xl font-bold text-gray-800 mb-2 text-center text-shadow-md"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        Ofertas Especiales
                      </motion.h2>
                      <motion.p
                        className="text-gray-600 text-center "
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        No te pierdas nuestras mejores ofertas
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <ListItemSlider
                        items={offerProducts}
                        type="product"
                        breakpoints={{
                          320: 1,
                          640: 2,
                          840: 3,
                          1024: 4,
                          1200: 4,
                          1400: 4,
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.section>
              ) : null;

            return sectionsOrder.map((key) => {
              if (key === "offers") return offersSection;
              return featuredSection;
            });
          })()}

          {areCategoriesFiltered && (
            <>
              <h2 className="text-2xl font-semibold mb-4 mt-10 text-center text-shadow-md">
                Todos nuestros productos
              </h2>
              <Filters
                categoriesList={categoriesList}
                storesList={[store]}
                initialMinPrice={minPrice}
                initialMaxPrice={maxPrice}
                className="shadow-sm"
                mode="products"
                showTabs={false}
              />
            </>
          )}
          <motion.section
            className="container px-8 py-4 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {store && (
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
                    aria-label="Información adicional de la tienda"
                    title="Información adicional de la tienda"
                    className="pt-6"
                  >
                    <p className="pb-4">
                      {store?.longDescription
                        ? store.longDescription
                        : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt eveniet expedita voluptatem facere unde itaque odit commodi praesentium? Amet sed suscipit culpa in commodi maxime consequuntur adipisci, ratione nulla quae?"}
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Condiciones de envío"
                    title="Condiciones de envío"
                  >
                    <p className="pb-4">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Incidunt eveniet expedita voluptatem facere unde itaque
                      odit commodi praesentium? Amet sed suscipit culpa in
                      commodi maxime consequuntur adipisci, ratione nulla quae?
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Información del vendedor"
                    title="Información del vendedor"
                    className="border-b-1 border-gray-300"
                  >
                    <div className="px-3 pb-4 border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-2 sm:grid md:grid-cols-4 sm:gap-2 md:px-2 bg-gray-200">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Nombre del vendedor
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 md:col-span-3 md:mt-0">
                            {store?.billingInfo?.name
                              ? store.billingInfo.name
                              : "Nombre del vendedor no disponible"}
                          </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid md:grid-cols-4 sm:gap-2 md:px-2">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Dirección
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 md:col-span-3 md:mt-0">
                            {store?.billingInfo?.address
                              ? store.billingInfo.address
                              : "Dirección no disponible"}
                          </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid md:grid-cols-4 sm:gap-2 md:px-2 bg-gray-200">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Teléfono
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 md:col-span-3 md:mt-0">
                            {store?.billingInfo?.phone ? (
                              <a
                                href={`tel:${store.billingInfo.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-primary duration-300"
                              >
                                {store.billingInfo.phone}
                              </a>
                            ) : (
                              "Teléfono no disponible"
                            )}
                          </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid md:grid-cols-4 sm:gap-2 md:px-2">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Correo electrónico
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 md:col-span-3 md:mt-0">
                            {store?.billingInfo?.email ? (
                              <a
                                href={`mailto:${store.billingInfo.email}`}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-primary duration-300"
                              >
                                {store.billingInfo.email}
                              </a>
                            ) : (
                              "Correo electrónico no disponible"
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            <div
              id="reviews-section"
              className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 "
            >
              <div>
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
                        <button
                          onClick={() => setRatingFilter(5 - index)}
                          className="text-sm text-gray-600 underline hover:text-primary cursor-pointer duration-300 transition"
                        >
                          {
                            storeReviews.filter(
                              (review) => review.rating === 5 - index,
                            ).length
                          }{" "}
                          reseñas
                        </button>
                      </div>
                    ))}
                  </div>

                  {user && (
                    <div className="w-full pt-8">
                      <form onSubmit={onSubmit} className="space-y-4 w-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-5">
                          Deja tu reseña
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

              <div>
                <div className="flex flex-col p-3">
                  <AnimatePresence mode="popLayout">
                    {filteredReviews.map((review) => (
                      <motion.div
                        key={review._id}
                        variants={reviewVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="pt-0"
                      >
                        <div key={review._id} className="pt-8">
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
                                  "dd-MM-yyyy",
                                )}
                              </p>
                            )}
                            <span className="text-gray-600">
                              {review.comment}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {ratingFilter !== null && (
                    <motion.div
                      key={ratingFilter}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 text-sm text-gray-600"
                    >
                      Mostrando reseñas de{" "}
                      <strong>{ratingFilter} estrellas</strong>
                      <button
                        onClick={() => setRatingFilter(null)}
                        className="ml-2 underline hover:text-primary"
                      >
                        Quitar filtro
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>
        </>
      )}

      {store?.active === false && !isStoreOwner && (
        <div className="bg-white p-6 rounded-md shadow-md text-center text-gray-700 mt-10">
          Esta tienda está temporalmente inactiva y no es posible ver sus
          productos.
        </div>
      )}
    </>
  );
}
