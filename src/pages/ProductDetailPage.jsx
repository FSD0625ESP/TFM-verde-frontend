import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import Gallery from "../components/Gallery/Gallery";
import { Button, Accordion, AccordionItem } from "@heroui/react";
import ListElement from "../components/ListElement/ListElement";
import Rating from "../components/Rating/Rating";
import { format, parseISO } from "date-fns";
import { ShoppingBag, User, UserPlus } from "lucide-react";
import {
  getProductById,
  getAllProducts,
  //getAllFeaturedProducts,
  getAllCategories,
  getProductReviewsById,
} from "../services/api";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProductDetailPage() {
  //obtenemos la id del producto de la url
  const { id: productId } = useParams();

  const [product, setProduct] = useState({});
  const [productReviews, setProductReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
      console.log("product", data);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const data = await getProductReviewsById(productId);
      setProductReviews(data);
      console.log("productReviews", data);
      setTotalReviews(data.length);
      setAverageRating(
        data.reduce((acc, review) => acc + review.rating, 0) / data.length
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

  /*  Formulario de reseñas  */

  const schema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(1).max(1000),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Zod schema with password policy: min 6, at least one uppercase and one number
  const schema = z
    .object({
      firstName: z.string().min(2, "El nombre es obligatorio"),
      lastName: z.string().min(2, "Los apellidos son obligatorios"),
      email: z.string().email("Email no válido"),
      password: z
        .string()
        .min(6, "Mínimo 6 caracteres")
        .regex(
          /(?=.*[A-Z])(?=.*\d)/,
          "La contraseña debe contener al menos una mayúscula y un número"
        ),
      verifyPassword: z.string(),
      agree: z
        .boolean()
        .refine((v) => v === true, { message: "Debes aceptar los términos" }),
    })
    .refine((data) => data.password === data.verifyPassword, {
      message: "Las contraseñas no coinciden",
      path: ["verifyPassword"],
    });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { agree: false },
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        "customer"
      );
      navigate("/");
      addToast({
        title: "Registro exitoso",
        description: response.msg || "Usuario registrado correctamente.",
        color: "success",
        duration: 5000,
      });
    } catch (error) {
      addToast({
        title: "Error de registro",
        description: error.response?.data?.msg || "Error de registro.",
        color: "danger",
        duration: 5000,
      });
    }
  };

  const inputStyleProps = {
    variant: "flat",
    classNames: {
      inputWrapper:
        "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
      input: "bg-white",
    },
  };

  return (
    <>
      <section className="max-w-[1536px] px-8 py-8 mx-auto">
        {product && (
          <div className="flex flex-row gap-4 position-relative">
            <div className="gallery sticky top-[100px] max-w-1/2 bg-primary/10 p-3 rounded-lg">
              {product.images && <Gallery images={product.images} />}
            </div>

            <div className="w-full flex flex-col p-3">
              <div className="flex flex-row items-center gap-2">
                {averageRating > 0 && (
                  <Rating
                    initialValue={averageRating ? Math.round(averageRating) : 0}
                    readonly
                    onRatingChange={(value) =>
                      console.log("Nueva valoración:", value)
                    }
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
              <div className="flex flex-row items-center gap-2 py-2">
                <h2 className="text-3xl font-semibold">{product.title}</h2>
              </div>
              <div className="flex flex-row items-center gap-2 py-2">
                {product.storeId && (
                  <span className="text-sm text-gray-600">
                    {product.storeId.name}
                  </span>
                )}
              </div>
              <p className="text-base text-gray-600">{product.description}</p>
              <div className="flex flex-row items-center gap-2 py-2">
                <span className="text-sm text-black font-semibold">
                  {product.price}$
                </span>
                <span className="text-sm text-gray-600">
                  unidades: {product.stock}
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
                    <p>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Incidunt eveniet expedita voluptatem facere unde itaque
                      odit commodi praesentium? Amet sed suscipit culpa in
                      commodi maxime consequuntur adipisci, ratione nulla quae?
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Valoraciones y reseñas"
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
                  >
                    <p>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Incidunt eveniet expedita voluptatem facere unde itaque
                      odit commodi praesentium? Amet sed suscipit culpa in
                      commodi maxime consequuntur adipisci, ratione nulla quae?
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Escribe aquí tu nombre"
                    {...register("firstName")}
                    isRequired
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                    {...inputStyleProps}
                  />
                  <Input
                    label="Apellidos"
                    placeholder="Escribe aquí tu nombre"
                    {...register("lastName")}
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                    {...inputStyleProps}
                  />
                  <Input
                    label="Email"
                    placeholder="example@correo.com"
                    type="email"
                    {...register("email")}
                    isRequired
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    {...inputStyleProps}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter password"
                    type={isVisible ? "text" : "password"}
                    {...register("password")}
                    isRequired
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    endContent={
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        className="focus:outline-none text-default-400"
                      >
                        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    {...inputStyleProps}
                  />
                  <Input
                    label="Confirma tu password"
                    placeholder="Enter password"
                    type={isVisible2 ? "text" : "password"}
                    {...register("verifyPassword")}
                    isRequired
                    isInvalid={!!errors.verifyPassword}
                    errorMessage={errors.verifyPassword?.message}
                    endContent={
                      <button
                        type="button"
                        onClick={toggleVisibility2}
                        className="focus:outline-none text-default-400"
                      >
                        {isVisible2 ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    {...inputStyleProps}
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
