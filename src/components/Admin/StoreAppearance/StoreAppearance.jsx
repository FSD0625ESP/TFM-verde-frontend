import { Card, CardBody, Button, Tabs, Tab } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { Palette, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { StoreContext } from "../../../contexts/StoreContext.jsx";
import StoreImageSelector from "./StoreImageSelector";
import StoreSliderManager from "./StoreSliderManager";
import SectionToggleCard from "./SectionToggleCard";
import FeaturedProductsSelector from "./FeaturedProductsSelector";
import OfferProductsSelector from "./OfferProductsSelector";
import * as apiClient from "../../../services/api";
import { motion as Motion } from "framer-motion";

export default function StoreAppearance() {
    const {
        storeData,
        setStoreData,
        toggleFeaturedSection,
        toggleOfferSection,
        toggleSlider,
    } = useContext(StoreContext);

    const [activeTab, setActiveTab] = useState("general");
    const [isSavingSections, setIsSavingSections] = useState(false);
    const [isSavingSlider, setIsSavingSlider] = useState(false);
    const [sectionsOrder, setSectionsOrder] = useState(
        storeData?.appearance?.sectionsOrder ?? ["featured", "offers"]
    );

    useEffect(() => {
        if (Array.isArray(storeData?.appearance?.sectionsOrder)) {
            setSectionsOrder(storeData.appearance.sectionsOrder);
        }
    }, [storeData?.appearance?.sectionsOrder]);

    useEffect(() => {
        const storeId = storeData?._id;
        if (!storeId) return;

        let isMounted = true;
        (async () => {
            try {
                const data = await apiClient.getStoreAppearance(storeId);
                if (!isMounted || !data?.appearance) return;
                setStoreData((prev) => ({
                    ...prev,
                    appearance: {
                        ...prev.appearance,
                        ...data.appearance,
                    },
                }));
            } catch (error) {
                console.error("❌ Error al cargar apariencia:", error);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [storeData?._id, setStoreData]);

    const handleSaveSections = async () => {
        if (!storeData?._id) return;
        setIsSavingSections(true);
        try {
            const response = await apiClient.updateStoreAppearance(storeData._id, {
                showFeaturedSection: storeData?.appearance?.showFeaturedSection ?? true,
                showOfferSection: storeData?.appearance?.showOfferSection ?? true,
                sectionsOrder,
            });

            if (response?.appearance) {
                setStoreData((prev) => ({
                    ...prev,
                    appearance: {
                        ...prev.appearance,
                        ...response.appearance,
                    },
                }));
            }
        } catch (error) {
            console.error("❌ Error al guardar:", error);
        } finally {
            setIsSavingSections(false);
        }
    };

    const handleSaveSlider = async () => {
        if (!storeData?._id) return;
        setIsSavingSlider(true);
        try {
            const response = await apiClient.updateStoreAppearance(storeData._id, {
                showSlider: storeData?.appearance?.showSlider ?? false,
            });

            if (response?.appearance) {
                setStoreData((prev) => ({
                    ...prev,
                    appearance: {
                        ...prev.appearance,
                        ...response.appearance,
                    },
                }));
            }
        } catch (error) {
            console.error("❌ Error al guardar slider:", error);
        } finally {
            setIsSavingSlider(false);
        }
    };

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Palette size={28} className="text-primary" />
                        Apariencia de la tienda
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Personaliza cómo se ve tu tienda en la plataforma
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                aria-label="Opciones de apariencia"
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                variant="bordered"
                color="primary"
                classNames={{
                    tabList: "gap-4 bg-white border-b border-gray-200 px-1",
                    cursor: "w-full bg-primary",
                    tab: "max-w-md",

                }}
            >
                {/* Tab: General */}
                <Tab
                    key="general"
                    title={
                        <div className="flex items-center gap-2">
                            <ImageIcon size={18} />
                            <span>General</span>
                        </div>
                    }
                >
                    <Card className="mt-4">
                        <CardBody className="space-y-6">
                            <StoreImageSelector />
                        </CardBody>
                    </Card>
                </Tab>

                {/* Tab: Secciones */}
                <Tab
                    key="sections"
                    title={
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            <span>Secciones</span>
                        </div>
                    }
                >
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 mt-4"
                    >
                        <Card>
                            <CardBody className="flex flex-col gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold">Orden de secciones</h3>
                                    <p className="text-sm text-gray-600">Elige qué sección aparece primero</p>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        color={sectionsOrder?.[0] === "featured" ? "primary" : "default"}
                                        variant={sectionsOrder?.[0] === "featured" ? "solid" : "bordered"}
                                        className={sectionsOrder?.[0] === "featured" ? "text-white" : ""}
                                        onClick={() => setSectionsOrder(["featured", "offers"])}
                                    >
                                        Destacados antes
                                    </Button>
                                    <Button
                                        color={sectionsOrder?.[0] === "offers" ? "primary" : "default"}
                                        variant={sectionsOrder?.[0] === "offers" ? "solid" : "bordered"}
                                        className={sectionsOrder?.[0] === "offers" ? "text-white" : ""}
                                        onClick={() => setSectionsOrder(["offers", "featured"])}
                                    >
                                        Ofertas antes
                                    </Button>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        color="primary"
                                        className="font-medium text-white"
                                        isLoading={isSavingSections}
                                        onClick={handleSaveSections}
                                    >
                                        {isSavingSections ? "Guardando..." : "Guardar secciones"}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Sección Destacados */}
                        <SectionToggleCard
                            title="Sección de Destacados"
                            description="Muestra tus productos estrella en una sección especial"
                            isEnabled={storeData?.appearance?.showFeaturedSection ?? true}
                            onToggle={toggleFeaturedSection}
                            icon={Sparkles}
                            info="Los productos destacados se mostrarán en una sección especial en tu tienda"
                        >
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    La selección de productos se actualiza en el momento en que los seleccionas o los quitas.
                                </p>
                                <FeaturedProductsSelector />
                            </div>
                        </SectionToggleCard>

                        {/* Sección Ofertas */}
                        <SectionToggleCard
                            title="Sección de Ofertas"
                            description="Muestra productos en oferta de forma destacada"
                            isEnabled={storeData?.appearance?.showOfferSection ?? true}
                            onToggle={toggleOfferSection}
                            icon={Zap}
                            info="Los productos marcados como 'en oferta' se mostrarán aquí"
                        >
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    La selección de productos se actualiza en el momento en que los seleccionas o los quitas.
                                </p>
                                <OfferProductsSelector />
                            </div>
                        </SectionToggleCard>
                    </Motion.div>
                </Tab>

                {/* Tab: Slider */}
                <Tab
                    key="slider"
                    title={
                        <div className="flex items-center gap-2">
                            <Zap size={18} />
                            <span>Slider</span>
                        </div>
                    }
                >
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4"
                    >
                        <SectionToggleCard
                            title="Slider principal"
                            description="Muestra un carrusel de imágenes al principio de tu tienda"
                            isEnabled={storeData?.appearance?.showSlider ?? false}
                            onToggle={toggleSlider}
                            icon={ImageIcon}
                            info="Carga imágenes que se mostrarán en un slider rotativo"
                        >
                            <StoreSliderManager />
                        </SectionToggleCard>

                        <div className="flex justify-end pt-4">
                            <Button
                                color="primary"
                                className="font-medium text-white"
                                isLoading={isSavingSlider}
                                onClick={handleSaveSlider}
                            >
                                {isSavingSlider ? "Guardando..." : "Guardar slider"}
                            </Button>
                        </div>
                    </Motion.div>
                </Tab>
            </Tabs>
        </Motion.div>
    );
}