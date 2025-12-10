import { Card, CardHeader, CardBody, Button, Chip, Tooltip, image } from "@heroui/react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useRef, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";
import { FilePond, registerPlugin } from "react-filepond";
import * as api from "../../services/api";

// Plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

// CSS
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register Plugins
registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview
);

export default function StoreSliderManager() {
    const { storeData, updateSliderImages, removeSliderImage } = useContext(StoreContext);
    const sliderImages = storeData?.appearance?.sliderImages || [];
    const pondRef = useRef();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpdateFiles = (fileItems) => {
        const newImages = fileItems
            .filter((item) => item.serverId)
            .map((item) => item.serverId);

        if (newImages.length > 0) {
            const allImages = [...sliderImages, ...newImages];
            updateSliderImages(allImages);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Slider de tienda</h3>
                    <p className="text-sm text-gray-600">
                        Carga imágenes para mostrar en el slider de tu tienda
                    </p>
                </CardHeader>

                <CardBody className="space-y-6">
                    {/* FilePond para upload */}
                    <div>
                        <label className="mb-2 block font-medium text-sm">Imágenes del slider</label>

                        <FilePond
                            ref={pondRef}
                            allowMultiple={true}
                            allowReorder={true}
                            allowImagePreview={true}
                            imagePreviewWidth={120}
                            maxFiles={10}
                            onupdatefiles={handleUpdateFiles}
                            acceptedFileTypes={["image/*"]}
                            labelIdle='Arrastra imágenes o <span class="filepond--label-action">explora</span>'
                            allowFileSizeValidation={true}
                            imageResizeTargetWidth={1200}
                            imageResizeTargetHeight={600}
                            maxFileSize="5MB"
                            server={{
                                process: async (fieldName, file, metadata, load, error, progress) => {
                                    try {
                                        setIsUploading(true);
                                        const result = await api.uploadSliderImage(file, storeData._id);
                                        load(result.url);
                                    } catch (err) {
                                        error(err.message);
                                    } finally {
                                        setIsUploading(false);
                                    }
                                },
                            }}
                        />
                    </div>

                    {/* Grid de imágenes del slider */}
                    {sliderImages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                        >
                            <AnimatePresence>
                                {sliderImages.map((imageUrl, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative group"
                                    >
                                        <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={imageUrl}
                                                alt={`Slider ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Overlay con botón eliminar */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                                            >
                                                <Tooltip content="Eliminar imagen">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        className="bg-danger text-white hover:bg-danger-600"
                                                        onClick={() => removeSliderImage(imageUrl)}
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </Tooltip>
                                            </motion.div>

                                            {/* Número de posición */}
                                            <div className="absolute top-1 left-1 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Estado vacío */}
                    {sliderImages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <p className="text-gray-500">No hay imágenes en el slider</p>
                        </motion.div>
                    )}

                    {/* Info de imágenes */}
                    {sliderImages.length > 0 && (
                        <Chip
                            variant="flat"
                            color="primary"
                            className="w-fit"
                        >
                            {sliderImages.length} imagen{sliderImages.length !== 1 ? "s" : ""} agregada{sliderImages.length !== 1 ? "s" : ""}
                        </Chip>
                    )}

                    {/* Recomendaciones */}
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium text-blue-900">Recomendaciones:</p>
                        <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                            <li>Tamaño mínimo: 1200x600px</li>
                            <li>Formato: PNG, JPG o WebP</li>
                            <li>Máximo 5MB por imagen</li>
                            <li>Usa imágenes de alta calidad</li>
                            <li>Procura que sean del mismo aspecto</li>
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
}




