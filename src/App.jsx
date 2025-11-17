import "./App.css";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import StoresPage from "./pages/StoresPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Buscador from "./components/Buscador/Buscador.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { useContext } from "react";
import Contacto from "./pages/ConocenosPage/Contacto.jsx";
import QuienesSomos from "./pages/ConocenosPage/QuienesSomos.jsx";
import AvisoPrivacidad from "./pages/LegalPage/AvisoPrivacidad.jsx";
import CondicionesUso from "./pages/LegalPage/CondicionesUso.jsx";
import Cookies from "./pages/LegalPage/Cookies.jsx";
import Legal from "./pages/LegalPage/Legal.jsx";
import HazteVolunt from "./pages/Colabora/HazteVolunt.jsx";
import Donaciones from "./pages/Colabora/Donaciones.jsx";
import Empleo from "./pages/Colabora/Empleo.jsx";
import AbrirTienda from "./pages/Vendedores/AbrirTienda.jsx";
import VentaParticulares from "./pages/Vendedores/VentaParticulares.jsx";
import VentaProfesionales from "./pages/Vendedores/VentaProfesionales.jsx";
import ResultadosPage from "./pages/ResultadosPage.jsx";
import CartPage from "./pages/EmptyCartPage.jsx";
import FullCartPage from "./pages/FullCartPage.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";

function App() {
  const { user } = useContext(AuthContext);

  const isUserLoggedIn = () => {
    return user !== null;
  };

  return (
    <CartProvider>
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
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product-detail/:id" element={<ProductDetailPage />} />
            <Route path="/resultados" element={<ResultadosPage />} />
            <Route path="/contact" element={<Contacto />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/donaciones" element={<Donaciones />} />
            <Route path="/empleo" element={<Empleo />} />
            <Route path="/hazte-volunt" element={<HazteVolunt />} />
            <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
            <Route path="/condiciones-uso" element={<CondicionesUso />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/abrir-tienda" element={<AbrirTienda />} />
            <Route path="/venta-particulares" element={<VentaParticulares />} />
            <Route
              path="/venta-profesionales"
              element={<VentaProfesionales />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/full-cart" element={<FullCartPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
