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
} from "@heroui/react";
import logo from "../../assets/logo.png";


export default function App() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [userLocation, setUserLocation] = React.useState(null);

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
        <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-primary-500">
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <img src={logo} className="w-20 h-auto" alt="Acme Logo" />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
                <NavbarItem className="hidden lg:flex">
                    <Button as={Link} to="/login" color="default">
                        Login
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} to="/register" color="secondary"  >
                        Sign Up
                    </Button>
                </NavbarItem>
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
            </NavbarMenu>
        </Navbar>
    );
}