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
} from "@heroui/react";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../contexts/AuthContext";
import { User as UserIcon, Store, ShoppingBag, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function App() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [userLocation, setUserLocation] = React.useState(null);
    const { user, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const location = useLocation();

    React.useEffect(() => {
        setUserLocation(location.pathname);
        console.log("Current location:", location.pathname);
    }, [location]);

    const menuItems = [
        {
            label: "Inicio",
            href: "/",
        },
        {
            label: "Tiendas",
            href: "/stores",
        },
        {
            label: "Productos",
            href: "/products",
        },
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-primary-500" maxWidth="2xl" classNames={{
            wrapper: "container mx-auto ", // o "max-w-7xl mx-auto px-4"
        }} >
            <NavbarContent className="">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <img src={logo} className="w-20 h-auto" alt="Acme Logo" />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4 mx-auto" justify="center">
                <NavbarItem isActive={userLocation === "/"}>
                    <HeroLink as={Link} to="/" aria-current="page" className={`text-white text-xl font-bold ${userLocation === "/" ? "text-shadow-md text-secondary" : ""}`}>
                        INICIO
                    </HeroLink>
                </NavbarItem>
                <NavbarItem isActive={userLocation === "/stores"} >
                    <HeroLink as={Link} to="/stores" aria-current="page" className={`text-white text-xl font-bold ${userLocation === "/stores" ? "text-shadow-md text-secondary" : ""}`}>
                        TIENDAS
                    </HeroLink>
                </NavbarItem>
                <NavbarItem isActive={userLocation === "/products"}>
                    <HeroLink as={Link} to="/products" aria-current="page" className={`text-white text-xl font-bold ${userLocation === "/products" ? "text-shadow-md text-secondary" : ""}`}>
                        PRODUCTOS
                    </HeroLink>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {user ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                size="md"
                                src={user.profileImage || undefined}
                                name={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Opciones de usuario"
                            onAction={(key) => {
                                if (key === "logout") return logout();
                                if (key === "profile") return navigate("/profile");
                                if (key === "store") return navigate("/my-store");
                                if (key === "orders") return navigate("/orders");
                            }}
                        >
                            <DropdownItem key="profile" startContent={<UserIcon size={18} />}>
                                Perfil
                            </DropdownItem>
                            <DropdownItem key="store" startContent={<Store size={18} />}>
                                Mi tienda
                            </DropdownItem>
                            <DropdownItem key="orders" startContent={<ShoppingBag size={18} />}>
                                Mis pedidos
                            </DropdownItem>
                            <DropdownItem key="logout" className="text-danger" color="danger" startContent={<LogOut size={18} />}>
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Button as={Link} to="/login" color="default">
                                Login
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} to="/register" color="secondary">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`nav-menu-item-${index}`}>
                        <HeroLink
                            as={Link}
                            to={`${item.href.toLowerCase().replace(/\s+/g, '-')}`}
                            className={`w-full ${index === 2 ? "text-primary-500" :
                                index === menuItems.length - 1 ? "text-danger-500" :
                                    "text-foreground"
                                }`}
                        >
                            {item.label}
                        </HeroLink>
                    </NavbarMenuItem>
                ))}
                {user ? (
                    <NavbarMenuItem>
                        <Button fullWidth color="danger" onPress={logout}>Logout</Button>
                    </NavbarMenuItem>
                ) : (
                    <>
                        <NavbarMenuItem>
                            <Button as={Link} to="/login" fullWidth color="default">Login</Button>
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Button as={Link} to="/register" fullWidth color="secondary">Sign Up</Button>
                        </NavbarMenuItem>
                    </>
                )}
            </NavbarMenu>
        </Navbar>
    );
}