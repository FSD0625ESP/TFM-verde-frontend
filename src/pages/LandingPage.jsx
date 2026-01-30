import { motion } from "framer-motion";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import {
    Store,
    TrendingUp,
    Amphora,
    Shield,
    Zap,
    Users,
    BarChart3,
    MessageSquare,
    Package,
    HandCoins,
    Star,
    ShoppingCart,
    Eye,
    Heart,
    Clock,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Palette,
    Bell,
    MapPin,
    CreditCard,
} from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Store className="w-8 h-8" />,
            title: "Tu Propia Tienda",
            description: "Crea y personaliza tu tienda online con logo, colores y diseño único",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Analytics Avanzado",
            description: "Dashboard completo con métricas, KPIs y análisis de ventas en tiempo real",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: "Chat en Tiempo Real",
            description: "Comunícate al instante con tus clientes mediante WebSockets",
            color: "from-green-500 to-emerald-500",
        },
        {
            icon: <Package className="w-8 h-8" />,
            title: "Gestión de Inventario",
            description: "Control total de productos, stock, precios y categorías",
            color: "from-orange-500 to-red-500",
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: "Notificaciones Push",
            description: "Mantente informado de pedidos, mensajes y actualizaciones importantes",
            color: "from-indigo-500 to-purple-500",
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: "Pagos Seguros",
            description: "Integración con Stripe para transacciones seguras y confiables",
            color: "from-yellow-500 to-orange-500",
        },
    ];

    const stats = [
        { icon: <Store />, value: "100+", label: "Tiendas Activas" },
        { icon: <Package />, value: "5000+", label: "Productos" },
        { icon: <Users />, value: "10K+", label: "Usuarios" },
        { icon: <ShoppingCart />, value: "50K+", label: "Pedidos" },
    ];

    const benefits = [
        {
            icon: <Palette />,
            title: "100% Personalizable",
            description: "Diseña tu tienda a tu estilo con colores, logos y sliders personalizados",
        },
        {
            icon: <Eye />,
            title: "Visibilidad Total",
            description: "Analíticas detalladas de visitantes, productos más vistos y comportamiento",
        },
        {
            icon: <MapPin />,
            title: "Geolocalización",
            description: "Integración con Mapbox para gestión de direcciones y envíos",
        },
        {
            icon: <Shield />,
            title: "Seguro y Confiable",
            description: "Sistema de reportes, valoraciones y moderación para garantizar calidad",
        },
        {
            icon: <Zap />,
            title: "Rendimiento Optimizado",
            description: "MongoDB aggregations y queries optimizadas para máxima velocidad",
        },
        {
            icon: <Clock />,
            title: "Seguimiento de Pedidos",
            description: "Tracking completo del estado de pedidos desde pendiente hasta entregado",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    const floatingVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary py-20 px-6">
                {/* Animated Background Elements */}
                <motion.div
                    className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-block mb-4"
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Amphora className="w-12 h-12 text-yellow-300 mx-auto" />
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                            Bienvenido a <span className="text-yellow-300">Meraki</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                            La plataforma de e-commerce que conecta pequeños negocios artesanales
                            con miles de compradores
                        </p>

                        <motion.div
                            className="flex flex-wrap gap-4 justify-center mb-8"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Button
                                size="lg"
                                color="warning"
                                variant="shadow"
                                className="font-semibold text-lg"
                                endContent={<ArrowRight />}
                                onPress={() => navigate("/abrir-tienda")}
                            >
                                Abre tu Tienda Gratis
                            </Button>
                            <Button
                                size="lg"
                                variant="bordered"
                                className="font-semibold text-lg text-white border-white hover:bg-white/20"
                                onPress={() => navigate("/stores")}
                            >
                                Explorar Tiendas
                            </Button>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap gap-3 justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Chip color="success" variant="flat" className="text-white bg-white/20">
                                <CheckCircle2 className="w-4 h-4 mr-1 inline" />
                                Sin comisiones ocultas
                            </Chip>
                            <Chip color="success" variant="flat" className="text-white bg-white/20">
                                <CheckCircle2 className="w-4 h-4 mr-1 inline" />
                                Soporte 24/7
                            </Chip>
                            <Chip color="success" variant="flat" className="text-white bg-white/20">
                                <CheckCircle2 className="w-4 h-4 mr-1 inline" />
                                Analytics incluido
                            </Chip>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6 bg-white/50 backdrop-blur-sm">
                <motion.div
                    className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <motion.div
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 text-white"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                {stat.icon}
                            </motion.div>
                            <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                            <p className="text-gray-600">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Todo lo que necesitas para{" "}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                vender online
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Una plataforma completa con todas las herramientas profesionales
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card
                                    className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20"
                                    isPressable
                                    isHoverable
                                >
                                    <CardBody className="p-6">
                                        <motion.div
                                            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 text-white shadow-lg`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            ¿Por qué elegir Meraki?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Más que un marketplace, una infraestructura completa para tu negocio
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <motion.div
                                            className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {benefit.icon}
                                        </motion.div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-95"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            variants={floatingVariants}
                            initial="initial"
                            animate="animate"
                            className="inline-block mb-6"
                        >
                            <HandCoins className="w-16 h-16 text-yellow-300 " />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Empieza a vender hoy mismo
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Únete a cientos de vendedores que ya están creciendo con Meraki.
                            Crea tu tienda en minutos, sin conocimientos técnicos.
                        </p>

                        <motion.div
                            className="flex flex-wrap gap-4 justify-center mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                size="lg"
                                color="warning"
                                variant="shadow"
                                className="font-semibold text-lg"
                                endContent={<Sparkles />}
                                onPress={() => navigate("/abrir-tienda")}
                            >
                                Crear Mi Tienda Ahora
                            </Button>
                            <Button
                                size="lg"
                                variant="bordered"
                                className="font-semibold text-lg text-white border-white hover:bg-white/20"
                                onPress={() => navigate("/contact")}
                            >
                                Contácta con Nosotros
                            </Button>
                        </motion.div>


                    </motion.div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Lo que dicen nuestros vendedores
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                name: "María García",
                                store: "Cerámica Artesanal",
                                text: "Meraki me ha permitido llegar a clientes que nunca imaginé. El dashboard de analytics es increíble.",
                                rating: 5,
                            },
                            {
                                name: "Pedro López",
                                store: "Joyería Handmade",
                                text: "La facilidad para gestionar mi inventario y chat con clientes es impresionante. ¡100% recomendado!",
                                rating: 5,
                            },
                            {
                                name: "Ana Martínez",
                                store: "Cosmética Natural",
                                text: "Desde que abrí mi tienda en Meraki, mis ventas han crecido un 300%. La plataforma es intuitiva y potente.",
                                rating: 5,
                            },
                        ].map((review, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                                    <CardBody className="p-6">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                                        <div>
                                            <p className="font-semibold text-gray-900">{review.name}</p>
                                            <p className="text-sm text-gray-500">{review.store}</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 px-6 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Heart className="w-12 h-12 text-red-500 fill-red-500 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold mb-4">
                            Hecho con pasión para artesanos
                        </h3>
                        <p className="text-gray-300 mb-8">
                            Meraki significa poner tu alma, creatividad y amor en tu trabajo.
                            Eso es exactamente lo que hacemos por ti.
                        </p>
                        <Button
                            size="lg"
                            color="primary"
                            variant="shadow"
                            endContent={<ArrowRight />}
                            onPress={() => navigate("/")}
                        >
                            Volver al Inicio
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
