import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // Cambia esto a la URL de tu backend
  withCredentials: true, // Habilita el envío de cookies
});

// Interceptor para añadir token desde localStorage si existe (fallback para navegación privada)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const loginUser = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  localStorage.setItem("user", JSON.stringify(response.data.user));
  
  // Si el backend envía token en el body, guardarlo (fallback para navegación privada)
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }
  
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
  
  // Si el backend envía token en el body, guardarlo
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }
  
  return response.data;
};

const getUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

const logoutUser = async () => {
  const response = await api.patch("/users/logout");
  // Limpiar token de localStorage
  localStorage.removeItem("authToken");
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

const updateStoreById = async (storeId, userId, storeData) => {
  const response = await api.patch(
    `/stores/update/${storeId}/${userId}`,
    storeData
  );
  return response.data;
};

// Login con Google: enviar idToken (credential) al backend
const loginWithGoogle = async (idToken) => {
  const response = await api.post("/users/google", { idToken });
  localStorage.setItem("user", JSON.stringify(response.data.user));
  
  // Si el backend envía token en el body, guardarlo
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }
  
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

const deleteProductById = async (id, userId) => {
  const response = await api.delete(`/products/delete-product/${id}/${userId}`);
  return response.data;
};

const updateProductById = async (id, productData) => {
  const response = await api.patch(
    `/products/update-product/${id}`,
    productData
  );
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
  // Solo enviar sessionId si NO hay usuario logueado
  const user = localStorage.getItem("user");
  const sessionId = user ? null : (localStorage.getItem("sessionId") || null);
  const response = await api.get(`/cart`, {
    params: { sessionId },
  });
  return response.data;
};

const addToCart = async ({ productId, quantity = 1 }) => {
  // Solo enviar sessionId si NO hay usuario logueado
  const user = localStorage.getItem("user");
  const sessionId = user ? null : (localStorage.getItem("sessionId") || null);
  const response = await api.post(`/cart/add`, {
    productId,
    quantity,
    sessionId,
  });
  return response.data;
};

const removeFromCart = async ({ productId }) => {
  // Solo enviar sessionId si NO hay usuario logueado
  const user = localStorage.getItem("user");
  const sessionId = user ? null : (localStorage.getItem("sessionId") || null);
  console.log("API: removing product from cart", productId);
  const response = await api.delete(`/cart/remove`, {
    data: { productId, sessionId },
  });
  return response.data;
};
const clearCart = async () => {
  // Solo enviar sessionId si NO hay usuario logueado
  const user = localStorage.getItem("user");
  const sessionId = user ? null : (localStorage.getItem("sessionId") || null);
  const response = await api.delete(`/cart/clear`, {
    data: { sessionId },
  });
  return response.data;
};

const replaceAnonymousCart = async (sessionId) => {
  const response = await api.post(`/cart/replace`, { sessionId });
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
  console.log("[Frontend API] Parámetros de búsqueda:", params);

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

const deleteProductImage = async (productId, public_id) => {
  const response = await api.delete(`/uploads/product/image`, {
    data: { productId, public_id },
  });
  return response.data;
};

const createProduct = async (productData) => {
  const response = await api.post("/products/add", productData);
  return response.data;
};

const getRelatedProducts = async (productId, categories = [], limit = 8) => {
  const response = await api.get(`/products/related/${productId}`, {
    params: {
      categories: Array.isArray(categories) ? categories.join(",") : categories,
      limit,
    },
  });
  return response.data;
};

// ========== ADDRESS API ==========
const getUserAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data;
};

const getAddressById = async (id) => {
  const response = await api.get(`/addresses/${id}`);
  return response.data;
};

const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);
  return response.data;
};

const updateAddress = async (id, addressData) => {
  const response = await api.patch(`/addresses/${id}`, addressData);
  return response.data;
};

const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};

const setDefaultAddress = async (id) => {
  const response = await api.patch(`/addresses/${id}/set-default`);
  return response.data;
};

// ========== PROFILE IMAGE API ==========
const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await api.post(`/uploads/profile/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updateUserProfile = async (firstName, lastName, phone = null) => {
  const response = await api.patch("/users/update-profile", {
    firstName,
    lastName,
    ...(phone && { phone }),
  });
  return response.data;
};

// ========== ORDERS API ==========
const getAdminOrders = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
  } = params;
  const response = await api.get("/orders/admin", {
    params: { page, limit, sortBy, sortOrder, search },
  });
  return response.data;
};

const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}`, { status });
  return response.data;
};

const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// ========== DELIVERIES API (tracking) ==========
const getDeliveryByOrderId = async (orderId) => {
  const response = await api.get(`/deliveries/order/${orderId}`);
  return response.data;
};

// ============================================
// STORE APPEARANCE API
// ============================================

const getStoreAppearance = async (storeId) => {
  const response = await api.get(`/stores/${storeId}/appearance`);
  return response.data;
};

const updateStoreAppearance = async (storeId, appearanceData) => {
  const payload = {};

  if (appearanceData.showFeaturedSection !== undefined) {
    payload.showFeaturedSection = appearanceData.showFeaturedSection;
  }
  if (appearanceData.showOfferSection !== undefined) {
    payload.showOfferSection = appearanceData.showOfferSection;
  }
  if (appearanceData.showSlider !== undefined) {
    payload.showSlider = appearanceData.showSlider;
  }
  if (appearanceData.sectionsOrder !== undefined) {
    payload.sectionsOrder = appearanceData.sectionsOrder;
  }
  if (appearanceData.sliderImages !== undefined) {
    payload.sliderImages = appearanceData.sliderImages;
  }

  const response = await api.patch(`/stores/${storeId}/appearance`, payload);
  return response.data;
};

const uploadStoreImage = async (file, storeId, isLogo = false) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", isLogo ? "logo" : "image");

  const response = await api.post(`/stores/${storeId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const uploadSliderImage = async (file, storeId) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post(`/stores/${storeId}/slider`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteSliderImage = async (storeId, imageUrl) => {
  const response = await api.delete(
    `/stores/${storeId}/slider/${encodeURIComponent(imageUrl)}`
  );
  return response.data;
};

const toggleProductFeatured = async (productId, destacado) => {
  const response = await api.patch(`/stores/products/${productId}/featured`, {
    destacado,
  });
  return response.data;
};

const toggleProductOffer = async (productId, oferta) => {
  const response = await api.patch(`/stores/products/${productId}/offer`, {
    oferta,
  });
  return response.data;
};

const getStoreFeaturedProducts = async (storeId) => {
  const response = await api.get(`/stores/${storeId}/featured-products`);
  return response.data;
};

const getStoreOfferProducts = async (storeId) => {
  const response = await api.get(`/stores/${storeId}/offer-products`);
  return response.data;
};

export const getPendingNotifications = async () => {
  const response = await api.get("/notifications/pending");
  return response.data;
};

// Export all functions
export {
  loginUser,
  registerUser,
  getUser,
  logoutUser,
  getAllStores,
  getStoreById,
  registerStore,
  updateStoreById,
  getStoreBySellerId,
  searchStores,
  getStoreAppearance,
  updateStoreAppearance,
  uploadStoreImage,
  uploadSliderImage,
  deleteSliderImage,
  toggleProductFeatured,
  toggleProductOffer,
  getStoreFeaturedProducts,
  getStoreOfferProducts,
  getAllProducts,
  getAllProductsByStoreId,
  getAllFeaturedProducts,
  getAllOfferProducts,
  getProductById,
  deleteProductById,
  updateProductById,
  searchProducts,
  createProduct,
  getRelatedProducts,
  uploadProductImage,
  deleteProductImage,
  getAllCategories,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  replaceAnonymousCart,
  getUserChats,
  getChatById,
  getOrCreateChat,
  sendMessage,
  deleteChat,
  getStoreReviewsById,
  getProductReviewsById,
  addStoreReview,
  addProductReview,
  generateForgotPasswordToken,
  changePassword,
  verifyForgotPasswordToken,
  loginWithGoogle,
  updateUserProfile,
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  uploadProfileImage,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDeliveryByOrderId,
  contactFormSend,
  // Analytics
  trackAnalyticsEvent,
  getStoreDashboard,
  getProductStats,
  getAdminOrders,
  // Reports
  createStoreReport,
  updateReportStatus,
  // Admin
  getAdminGlobalStats,
};

// ==================== ANALYTICS ====================

/**
 * Registrar un evento de analytics
 * @param {string} eventType - Tipo de evento: "view_product", "view_store", "add_to_cart", "purchase"
 * @param {string} storeId - ID de la tienda
 * @param {string} [productId] - ID del producto (requerido para view_product y add_to_cart)
 */
const trackAnalyticsEvent = async (eventType, storeId, productId = null) => {
  try {
    // Obtener sessionId de localStorage (consistente para usuarios anónimos y logueados)
    const sessionId = localStorage.getItem("sessionId");

    const payload = {
      eventType,
      storeId,
      sessionId,
    };

    if (productId) {
      payload.productId = productId;
    }
    const response = await api.post("/analytics/track", payload);
    return response.data;
  } catch (error) {
    // No lanzar error para no interrumpir la experiencia del usuario
    console.warn("Error al registrar analytics:", error.message);
    return null;
  }
};

/**
 * Obtener dashboard de analytics de una tienda
 * @param {string} storeId - ID de la tienda
 * @param {object} options - Opciones de filtrado
 * @param {string} [options.period] - Período: "24h", "7d", "30d", "90d"
 * @param {string} [options.startDate] - Fecha inicio (ISO string)
 * @param {string} [options.endDate] - Fecha fin (ISO string)
 */
const getStoreDashboard = async (storeId, options = {}) => {
  const params = new URLSearchParams();
  if (options.period) params.append("period", options.period);
  if (options.startDate) params.append("startDate", options.startDate);
  if (options.endDate) params.append("endDate", options.endDate);

  const queryString = params.toString();
  const url = `/analytics/dashboard/${storeId}${queryString ? `?${queryString}` : ""
    }`;

  const response = await api.get(url);
  return response.data;
};

/**
 * Obtener estadísticas de un producto específico
 * @param {string} productId - ID del producto
 * @param {string} [period] - Período: "24h", "7d", "30d", "90d","year"
 */
const getProductStats = async (productId, period = "7d") => {
  const response = await api.get(
    `/analytics/product/${productId}?period=${period}`
  );
  return response.data;
};

// ==================== REPORTS ====================

/**
 * Crear un reporte de tienda
 * @param {string} reporterId - ID del usuario que reporta
 * @param {string} storeId - ID de la tienda reportada
 * @param {string} reason - Razón del reporte: "spam", "inappropriate", "other"
 * @param {string} [description] - Descripción adicional del reporte
 */
const createStoreReport = async (reporterId, storeId, reason, description = "") => {
  const response = await api.post("/reports", {
    reporterId,
    storeId,
    reason,
    description,
  });
  return response.data;
};

// ==================== ADMIN ====================

/**
 * Obtener estadísticas globales del panel de administración
 * Solo accesible para usuarios con role: "admin"
 */
const getAdminGlobalStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

/**
 * Actualizar el estado de un reporte
 * @param {string} reportId - ID del reporte
 * @param {string} status - Nuevo estado: "pending", "reviewed", "resolved"
 */
const updateReportStatus = async (reportId, status) => {
  const response = await api.patch(`/reports/${reportId}/status`, { status });
  return response.data;
};
