import "./App.css";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import StoresPage from "./pages/StoresPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
