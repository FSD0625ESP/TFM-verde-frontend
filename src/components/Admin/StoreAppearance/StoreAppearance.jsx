import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Palette, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { StoreContext } from "../../../contexts/StoreContext.jsx";
import StoreImageSelector from "./StoreImageSelector";
import StoreSliderManager from "./StoreSliderManager";
import SectionToggleCard from "./SectionToggleCard";
import FeaturedProductsSelector from "./FeaturedProductsSelector";
import OfferProductsSelector from "./OfferProductsSelector";
import * as api from "../../../services/api";
import { motion } from "framer-motion";

export default function StoreAppearance({ sellerStore }) {
  const { storeData, toggleFeaturedSection, toggleOfferSection, toggleSlider } =
    useContext(StoreContext);

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const appearanceData = {
        showFeaturedSection: storeData?.appearance?.showFeaturedSection ?? true,
        showOfferSection: storeData?.appearance?.showOfferSection ?? true,
        showSlider: storeData?.appearance?.showSlider ?? false,
      };

      await api.updateStoreAppearance(storeData._id, appearanceData);

      console.log("✅ Cambios guardados correctamente");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 mt-4"
          >
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
              <OfferProductsSelector />
            </SectionToggleCard>
          </motion.div>
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
          <motion.div
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
          </motion.div>
        </Tab>
      </Tabs>

      {/* Footer con botones de acción */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 justify-end pt-4 border-t"
      >
        <Button
          variant="bordered"
          className="font-medium"
          onClick={() => window.location.reload()}
        >
          Descartar cambios
        </Button>
        <Button
          color="primary"
          className="font-medium text-white"
          isLoading={isSaving}
          onClick={handleSaveChanges}
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
