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
import ChatToggler from "./components/Chat/ChatToggler.jsx";
import ChatsDropdown from "./components/Chat/ChatsDropdown.jsx";
import ChatContainer from "./components/Chat/ChatContainer.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { useContext, useState, useEffect } from "react";

function App() {
  const { user } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [totalUnread, setTotalUnread] = useState(0);

  const isUserLoggedIn = () => {
    return user !== null;
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isChatOpen) {
      setSelectedChat(null); // Cerrar chat abierto al cerrar el panel
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Reducir el contador de no leídos cuando se abre un chat
    setTotalUnread(prev => Math.max(0, prev - (chat.unreadCount || 0)));
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setIsChatOpen(false);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  // Callback para que ChatsDropdown actualice el total de no leídos
  const handleUnreadUpdate = (count) => {
    setTotalUnread(count);
  };

  // Escuchar eventos de creación de chat desde StartChatButton
  useEffect(() => {
    const handleOpenChat = (event) => {
      const chatData = event.detail;
      setIsChatOpen(true);
      setSelectedChat(chatData);
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <main className="flex flex-col justify-center flex-1 bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/forgotPassword" element={<LoginPage />} />
          <Route path="/login/forgotPassword/:token" element={<LoginPage />} />
          <Route
            path="/register"
            element={isUserLoggedIn() ? <Home /> : <RegisterPage />}
          />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product-detail/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
      <Footer />

      {/* Sistema de Chat - Solo visible cuando el usuario está logueado */}
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
  );
}

export default App;
