import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as HeroLink,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Chip,
} from "@heroui/react";
import Logo from "../../assets/logo_white.svg?react";
import { AuthContext } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  UserPlus,
  Store,
  ShoppingBag,
  LogOut,
  LogIn,
  Search,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Buscador from "../Buscador/Buscador";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = React.useContext(AuthContext);
  const { cart } = useCart();
  console.log("👤 User in Header:", user);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Inicio",
      href: "/",
      icon: null,
      loginRequired: false,
      mobileOnly: false,
    },
    {
      label: "Tiendas",
      href: "/stores",
      icon: null,
      loginRequired: false,
      mobileOnly: false,
    },
    {
      label: "Productos",
      href: "/products",
      icon: null,
      loginRequired: false,
      mobileOnly: false,
    },
    {
      label: "Mi tienda",
      href: "/store-admin",
      icon: Store,
      loginRequired: true,
      mobileOnly: false,
    },
    {
      label: "Carrito",
      href: "/cart",
      icon: ShoppingBag,
      loginRequired: false,
      mobileOnly: false,
    },
    {
      label: "Registro",
      href: "/register",
      icon: UserPlus,
      loginRequired: false,
      mobileOnly: false,
      showOnlyWhenLoggedOut: true,
    },
    {
      label: "Login",
      href: "/login",
      icon: LogIn,
      loginRequired: false,
      mobileOnly: false,
      showOnlyWhenLoggedOut: true,
    },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-primary-500 h-20 shadow-sm"
      maxWidth="2xl"
      classNames={{
        wrapper: "container mx-auto ", // o "max-w-7xl mx-auto px-4"
      }}
    >
      <NavbarContent className="">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="max-[830px]:block hidden"
        />
        <NavbarBrand>
          {/* <img src={logo} className="w-20 h-auto" alt="Acme Logo" /> */}
          <Logo
            className="w-18 p-1 h-auto text-white drop-shadow-md hover:drop-shadow-2xl hover:w-19 transition-all cursor-pointer"
            onClick={() => {
              navigate("/");
              setIsMenuOpen(false);
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden min-[830px]:flex gap-4 items-center"
        justify="start"
      >
        <NavbarItem className="hidden min-[830px]:block">
          <Buscador />
        </NavbarItem>

        {/* Links sin icono (texto simple) */}
        {menuItems
          .filter(
            (item) =>
              !item.icon &&
              (!item.loginRequired || user) &&
              (!item.showOnlyWhenLoggedOut || !user)
          )
          .map((menuItem) => (
            <NavbarItem
              key={menuItem.href}
              isActive={location.pathname === menuItem.href}
            >
              <HeroLink
                as={Link}
                to={menuItem.href}
                aria-current="page"
                className={`text-black text-shadow-sm font-bold hover:text-secondary hover:text-md transition-colors duration-200 uppercase text-sm
                                    ${location.pathname === menuItem.href
                    ? "font-bold text-white"
                    : ""
                  }
                                `}
              >
                {menuItem.label}
              </HeroLink>
            </NavbarItem>
          ))}

        {/* Links con icono (icono arriba, texto abajo) */}
        {menuItems
          .filter(
            (item) =>
              item.icon &&
              (!item.loginRequired || user) &&
              (!item.showOnlyWhenLoggedOut || !user)
          )
          .map((menuItem) => (
            <NavbarItem
              key={menuItem.href}
              isActive={location.pathname === menuItem.href}
            >
              {menuItem.href === "/cart" ? (
                <HeroLink
                  as={Link}
                  to={menuItem.href}
                  aria-current="page"
                  className="relative flex flex-col items-center gap-1 text-shadow-xl text-black hover:text-secondary transition-colors duration-200"
                >
                  <div className="relative">
                    <menuItem.icon
                      size={24}
                      strokeWidth={1.5}
                      className="drop-shadow"
                    />
                    {cart.length > 0 && (
                      <Chip
                        isOneChar
                        size="sm"
                        className="absolute -top-2 -right-2 bg-danger text-white font-bold"
                        variant="light"
                      >
                        {/* sum all quantities in cart */}
                        {
                          cart.reduce((total, item) => total + item.quantity, 0)
                        }
                      </Chip>
                    )}
                  </div>
                  <span className="text-xs font-medium text-shadow-sm">
                    {menuItem.label}
                  </span>
                </HeroLink>
              ) : (
                <HeroLink
                  as={Link}
                  to={menuItem.href}
                  aria-current="page"
                  className={`flex flex-col items-center gap-1 text-shadow-xl text-black hover:text-secondary transition-colors duration-200
                                    ${location.pathname === menuItem.href
                      ? "font-bold text-white"
                      : ""
                    }
                                `}
                >
                  <menuItem.icon
                    size={24}
                    strokeWidth={1.5}
                    className="drop-shadow"
                  />
                  <span className="text-xs font-medium text-shadow-sm">
                    {menuItem.label}
                  </span>
                </HeroLink>
              )}
            </NavbarItem>
          ))}
        {user && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                classNames={{
                  base: "bg-secondary-500 hover:bg-secondary-600 transition-colors",
                  icon: "text-white",
                }}
                as="button"
                className="transition-transform hover:scale-105"
                size="md"
                icon={!user.profileImage ? <User /> : undefined}
                src={user.profileImage}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Opciones de usuario"
              onAction={(key) => {
                if (key === "logout") return logout();
                if (key === "profile") return navigate("/profile");
                if (key === "store") return navigate("/store-admin");
                if (key === "orders") return navigate("/orders");
              }}
            >
              <DropdownItem key="profile" startContent={<UserPlus size={18} />}>
                Perfil
              </DropdownItem>
              {user.role === "seller" && (
                <DropdownItem key="store" startContent={<Store size={18} />}>
                  Mi tienda
                </DropdownItem>
              )}
              <DropdownItem
                key="orders"
                startContent={<ShoppingBag size={18} />}
              >
                Mis pedidos
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<LogOut size={18} />}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      <NavbarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        className="pt-8"
      >
        {/* Buscador en móvil */}
        <NavbarMenuItem className="min-[831px]:hidden">
          <Buscador mobile />
        </NavbarMenuItem>

        {/* Items del menú en móvil */}
        {menuItems
          .filter(
            (item) =>
              (!item.loginRequired || user) &&
              (!item.showOnlyWhenLoggedOut || !user)
          )
          .map((item, index) => (
            <NavbarMenuItem key={`nav-menu-item-${index}`}>
              <HeroLink
                as={Link}
                to={item.href}
                onPress={() => setIsMenuOpen(false)}
                className={`w-full flex items-center gap-3 py-2 transition-colors relative ${location.pathname === item.href
                  ? "text-primary-500 font-bold"
                  : "text-foreground"
                  }`}
              >
                {item.icon && <item.icon size={20} />}
                {item.label}
                {item.href === "/cart" && cart.length > 0 && (
                  <Chip
                    isOneChar
                    size="sm"
                    className="ml-2 bg-danger text-white font-bold"
                    variant="light"
                  >
                    {/* sum all quantities in cart */}
                    {
                      cart.reduce((total, item) => total + item.quantity, 0)
                    }
                  </Chip>
                )}
              </HeroLink>
            </NavbarMenuItem>
          ))}

        {/* Botones de autenticación en móvil */}
        {user ? (
          <>
            <NavbarMenuItem className="pt-2">
              <div className="w-full h-px bg-gray-200"></div>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                fullWidth
                color="danger"
                onPress={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                variant="flat"
              >
                <LogOut size={22} className="mr-2" />
                Cerrar Sesión
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <></>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
