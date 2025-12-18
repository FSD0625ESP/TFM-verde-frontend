import "./App.css";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import StoresPage from "./pages/StoresPage.jsx";
import StoreDetailPage from "./pages/StoreDetailPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ChatToggler from "./components/Chat/ChatToggler.jsx";
import ChatsDropdown from "./components/Chat/ChatsDropdown.jsx";
import ChatContainer from "./components/Chat/ChatContainer.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { useContext, useState, useEffect } from "react";
import Contacto from "./pages/ConocenosPage/Contacto.jsx";
import QuienesSomos from "./pages/ConocenosPage/QuienesSomos.jsx";
import AvisoPrivacidad from "./pages/LegalPage/AvisoPrivacidad.jsx";
import CondicionesUso from "./pages/LegalPage/CondicionesUso.jsx";
import Cookies from "./pages/LegalPage/Cookies.jsx";
import HazteVolunt from "./pages/Colabora/HazteVolunt.jsx";
import Donaciones from "./pages/Colabora/Donaciones.jsx";
import Empleo from "./pages/Colabora/Empleo.jsx";
import AbrirTienda from "./pages/Vendedores/AbrirTienda.jsx";
import VentaParticulares from "./pages/Vendedores/VentaParticulares.jsx";
import VentaProfesionales from "./pages/Vendedores/VentaProfesionales.jsx";
import ResultadosPage from "./pages/ResultsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Profile from "./pages/Profile";
import Legal from "./pages/LegalPage/Legal.jsx";
import Orders from "./pages/Orders";
import StoreAdminPage from "./pages/StoreAdminPage.jsx";
import ProductForm from "./components/Admin/ProductForm/ProductForm.jsx";
import AdminProductList from "./components/Admin/AdminProductsList/AdminProductsList.jsx";
import AdminProductListAux from "./components/Admin/AdminProductsList/AdminProductsList.jsx";
import CheckOutPage from "./pages/CheckOutPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import StoreAppearance from "./components/Admin/StoreAppearance/StoreAppearance.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";

function App() {
  const { user } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [totalUnread, setTotalUnread] = useState(0);

  const isUserLoggedIn = () => user !== null;

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isChatOpen) setSelectedChat(null);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Reducir el contador de no leídos cuando se abre un chat
    setTotalUnread((prev) => Math.max(0, prev - (chat.unreadCount || 0)));
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setIsChatOpen(false);
  };

  const handleBackToList = () => setSelectedChat(null);

  const handleUnreadUpdate = (count) => setTotalUnread(count);

  useEffect(() => {
    const handleOpenChat = (event) => {
      const chatData = event.detail;
      setIsChatOpen(true);
      setSelectedChat(chatData);
    };

    window.addEventListener("openChat", handleOpenChat);
    return () => window.removeEventListener("openChat", handleOpenChat);
  }, []);

  return (
    <AlertProvider>
      <BrowserRouter>
        <Header />

        <main className="flex flex-col justify-center flex-1 bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/forgotPassword" element={<LoginPage />} />
            <Route
              path="/login/forgotPassword/:token"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={isUserLoggedIn() ? <Home /> : <RegisterPage />}
            />

            <Route
              path="/register/seller"
              element={<RegisterPage seller={true} />}
            />
            <Route
              path="/register/default"
              element={<RegisterPage default={true} />}
            />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/store/:storeName/:id" element={<StoreDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/product/:storeName/:productName/:id"
              element={<ProductDetailPage />}
            />
            <Route
              path="/store-admin/"
              element={
                isUserLoggedIn() && user.role === "seller" ? (
                  <StoreAdminPage />
                ) : (
                  <LoginPage />
                )
              }
            >
              {/* --- Rutas internas que cargan dentro del <Outlet /> --- */}
              <Route
                index
                element={<div>Bienvenido al panel de administración</div>}
              />

              <Route path="tienda" element={<div>Página de la tienda</div>} />

              <Route path="productos">
                {/* <Route path="todos" element={<AdminProductList />} /> */}
                <Route path="todos" element={<AdminProductListAux />} />
                <Route path="nuevo" element={<ProductForm />} />
                <Route path="editar/:id" element={<ProductForm />} />
              </Route>

              <Route path="pedidos" element={<div>Página Pedidos</div>} />
              <Route path="apariencia" element={<StoreAppearance />} />
              <Route path="cuenta" element={<div>Página Cuenta</div>} />
            </Route>
            <Route path="/resultados" element={<ResultadosPage />} />

            <Route path="/contact" element={<Contacto />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />

            <Route path="/donaciones" element={<Donaciones />} />
            <Route path="/empleo" element={<Empleo />} />
            <Route path="/hazte-volunt" element={<HazteVolunt />} />

            <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
            <Route path="/condiciones-uso" element={<CondicionesUso />} />
            <Route path="/cookies" element={<Cookies />} />

            <Route path="/abrir-tienda" element={<AbrirTienda />} />
            <Route path="/venta-particulares" element={<VentaParticulares />} />
            <Route
              path="/venta-profesionales"
              element={<VentaProfesionales />}
            />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
        </main>

        <Footer />

        {isUserLoggedIn() && (
          <>
            <ChatToggler
              isOpen={isChatOpen || selectedChat !== null}
              onToggle={handleToggleChat}
              unreadCount={totalUnread}
            />

            {!selectedChat && (
              <ChatsDropdown
                isOpen={isChatOpen}
                onSelectChat={handleSelectChat}
                onUnreadUpdate={handleUnreadUpdate}
              />
            )}

            {selectedChat && (
              <ChatContainer
                chat={selectedChat}
                onClose={handleCloseChat}
                onBack={handleBackToList}
              />
            )}
          </>
        )}
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
