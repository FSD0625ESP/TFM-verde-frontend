import "./App.css";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import StoresPage from "./pages/StoresPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Buscador from "./components/Buscador/Buscador.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { useContext } from "react";

function App() {
  const { user } = useContext(AuthContext);

  const isUserLoggedIn = () => {
    return user !== null;
  };

  return (
    <BrowserRouter>
      <Header />
      <main style={{ minHeight: "80vh" }} className="bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/forgotPassword" element={<LoginPage />} />
          <Route path="/login/forgotPassword/:token" element={<LoginPage />} />
          <Route path="/register" element={isUserLoggedIn() ? <Home /> : <RegisterPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
