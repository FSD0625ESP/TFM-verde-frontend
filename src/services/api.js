import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // Cambia esto a la URL de tu backend
  withCredentials: true, // Habilita el envío de cookies
});

const loginUser = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

const registerUser = async (
  firstName,
  lastName,
  email,
  password,
  role = "customer"
) => {
  const response = await api.post("/users/register", {
    firstName,
    lastName,
    email,
    password,
    role,
  });
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

const getUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

const logoutUser = async () => {
  const response = await api.patch("/users/logout");
  return response.data;
};

const getAllStores = async () => {
  const response = await api.get("/stores/all");
  return response.data;
};

const registerStore = async (storeData) => {
  const response = await api.post("/stores/register", storeData);
  return response.data;
};

// Login con Google: enviar idToken (credential) al backend
const loginWithGoogle = async (idToken) => {
  const response = await api.post("/users/google", { idToken });
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

const generateForgotPasswordToken = async (email) => {
  const response = await api.post("/users/generate-forgot-password-token", {
    email,
  });
  return response.data;
};

const forgotPassword = async (token, newPassword) => {
  const response = await api.post("/users/forgot-password", {
    token,
    newPassword,
  });
  return response.data;
};

const verifyForgotPasswordToken = async (token) => {
  const response = await api.post("/users/verify-forgot-password-token", {
    token,
  });
  return response.data;
};

const getAllProducts = async () => {
  const response = await api.get("/products/all");
  return response.data;
};

const getAllFeaturedProducts = async () => {
  const response = await api.get("/products/featured");
  return response.data;
};

const getAllOfferProducts = async () => {
  const response = await api.get("/products/offer");
  return response.data;
};

const getProductById = async (id) => {
  const response = await api.get(`/products/product/${id}`);
  return response.data;
};

const searchProducts = async (
  page = 1,
  text = "",
  categories = [],
  offer = false,
  min = 0,
  max = 500,
  signal = undefined // AbortSignal opcional para cancelar la petición
) => {
  // Enviar los parámetros como query params usando la opción `params` de axios
  const params = {
    page,
    text,
    categories: Array.isArray(categories) ? categories.join(",") : categories,
    offer,
    min,
    max,
  };

  console.log(
    "[Frontend] Sending search params:",
    JSON.stringify(params, null, 2)
  );
  // Pasar signal a axios (soporta AbortController desde axios v0.22+ / 1.x)
  const response = await api.get("/products/search", { params, signal });
  console.log("[Frontend] Found products: ", response.data);
  return response.data;
};

const getAllCategories = async () => {
  const response = await api.get("/categories/all");
  return response.data;
};

const getStoreReviewsById = async (id) => {
  const response = await api.get(`/reviews/store/${id}`);
  return response.data;
};

const getProductReviewsById = async (id) => {
  const response = await api.get(`/reviews/product/${id}`);
  return response.data;
};

export {
  loginUser,
  registerUser,
  getUser,
  logoutUser,
  getAllStores,
  registerStore,
  getAllProducts,
  getAllFeaturedProducts,
  getAllOfferProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getStoreReviewsById,
  getProductReviewsById,
  generateForgotPasswordToken,
  forgotPassword,
  verifyForgotPasswordToken,
  loginWithGoogle,
};
