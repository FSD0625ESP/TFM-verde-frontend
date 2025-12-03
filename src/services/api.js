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

const getStoreById = async (id) => {
  const response = await api.get(`/stores/store/${id}`);
  return response.data;
};

const getStoreBySellerId = async (id) => {
  const response = await api.get(`/stores/store/seller/${id}`);
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

const changePassword = async (token, newPassword) => {
  const response = await api.patch("/users/change-password", {
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

const getAllProductsByStoreId = async (id) => {
  const response = await api.get(`/products/store/${id}`);
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
  stores = [],
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
    stores: Array.isArray(stores) ? stores.join(",") : stores,
    offer,
    min,
    max,
  };

  console.log(
    "[Frontend API] searchProducts llamado con:",
    JSON.stringify({ page, text, categories, offer, min, max }, null, 2)
  );
  console.log(
    "[Frontend API] Params que se envían:",
    JSON.stringify(params, null, 2)
  );

  // Pasar signal a axios (soporta AbortController desde axios v0.22+ / 1.x)
  const response = await api.get("/products/search", { params, signal });
  console.log(
    "[Frontend API] Response recibido:",
    response.data?.length || 0,
    "productos"
  );
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

const addStoreReview = async ({ userId, storeId, rating, comment }) => {
  const response = await api.post(`/reviews/add/store/`, {
    userId,
    storeId,
    rating,
    comment,
  });
  return response.data;
};

const addProductReview = async ({ userId, productId, rating, comment }) => {
  const response = await api.post(`/reviews/add/product/`, {
    userId,
    productId,
    rating,
    comment,
  });
  return response.data;
};

// Obtener todos los chats del usuario autenticado
const getUserChats = async () => {
  const response = await api.get("/chats");
  return response.data;
};

// Obtener un chat específico por ID
const getChatById = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

// Obtener o crear un chat con una tienda
const getOrCreateChat = async (storeId) => {
  const response = await api.get(`/chats/store/${storeId}`);
  return response.data;
};

// Enviar un mensaje en un chat
const sendMessage = async (chatId, text) => {
  const response = await api.post(`/chats/${chatId}/messages`, { text });
  return response.data;
};

// Eliminar un chat
const deleteChat = async (chatId) => {
  const response = await api.delete(`/chats/${chatId}`);
  return response.data;
};

// -----------------------------
// Cart API helpers
// -----------------------------
const getCart = async () => {
  const response = await api.get(`/cart`);
  return response.data;
};

const addToCart = async ({ productId, quantity = 1 }) => {
  const response = await api.post(`/cart/add`, { productId, quantity });
  return response.data;
};

const removeFromCart = async ({ productId }) => {
  console.log("API: removing product from cart", productId);
  const response = await api.delete(`/cart/remove`, {
    data: { productId },
  });
  return response.data;
};

// Buscar tiendas con filtros
const searchStores = async (
  page = 1,
  text = "",
  categories = [],
  minRating = 0,
  maxRating = 5,
  signal = undefined
) => {
  const params = {
    page,
    text,
    categories: Array.isArray(categories) ? categories.join(",") : categories,
    minRating,
    maxRating,
  };

  const response = await api.get("/stores/search", { params, signal });
  return response.data;
};

const contactFormSend = async (formData) => {
  const response = await api.post("/users/contact", formData);
  return response.data;
};

const uploadProductImage = async (imageFile, productId) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("productId", productId);
  const response = await api.post(`/uploads/product/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const clearCart = async () => {
  const response = await api.delete(`/cart/clear`);
  return response.data;
};
const createProduct = async (productData) => {
  const response = await api.post("/products/add", productData);
  return response.data;
};

export {
  loginUser,
  registerUser,
  getUser,
  logoutUser,
  getAllStores,
  getStoreById,
  getStoreBySellerId,
  registerStore,
  searchStores,
  getAllProducts,
  getAllProductsByStoreId,
  getAllFeaturedProducts,
  getAllOfferProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getStoreReviewsById,
  getProductReviewsById,
  addStoreReview,
  addProductReview,
  generateForgotPasswordToken,
  changePassword,
  verifyForgotPasswordToken,
  loginWithGoogle,
  getUserChats,
  getChatById,
  getOrCreateChat,
  sendMessage,
  deleteChat,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  contactFormSend,
  uploadProductImage,
  createProduct,
};
