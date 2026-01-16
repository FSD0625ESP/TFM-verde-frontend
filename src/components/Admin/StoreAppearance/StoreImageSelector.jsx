import { Card, CardBody, Image, Button, addToast } from "@heroui/react";
import { X, Save } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useContext, useRef, useState, useEffect } from "react";
import { StoreContext } from "../../../contexts/StoreContext.jsx";
import { uploadStoreImage } from "../../../services/api";
import ListElement from "../../ListElement/ListElement";
import ImageEditorModal from "../ImageEditorModal/ImageEditorModal";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview
);

// Presets de tamaño para las imágenes
const IMAGE_PRESETS = {
    featured: {
        label: "Imagen destacada",
        minWidth: 800,
        minHeight: 600,
        aspectRatio: 4 / 3,
    },
    logo: {
        label: "Logo",
        minWidth: 200,
        minHeight: 200,
        aspectRatio: 1,
    },
};

export default function StoreImageSelector() {
    const { storeData, setStoreData } = useContext(StoreContext);

    const [previewImage, setPreviewImage] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    const [pendingImageFile, setPendingImageFile] = useState(null);
    const [pendingLogoFile, setPendingLogoFile] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    // Estados para el editor de crop
    const [editorFile, setEditorFile] = useState(null);
    const [editorType, setEditorType] = useState(null); // "image" o "logo"

    const imagePondRef = useRef();
    const logoPondRef = useRef();

    // Flag para evitar reabrir el editor cuando añadimos el archivo editado
    const isAddingFromEditor = useRef(false);

    // Inicializar con los datos actuales
    useEffect(() => {
        setPreviewImage(storeData?.image || null);
        setPreviewLogo(storeData?.logo || null);
    }, [storeData?.image, storeData?.logo]);

    const imageObjectUrlRef = useRef(null);
    const logoObjectUrlRef = useRef(null);

    const setPreviewFromFile = (file, type) => {
        const url = file ? URL.createObjectURL(file) : null;
        if (type === "image") {
            if (imageObjectUrlRef.current) URL.revokeObjectURL(imageObjectUrlRef.current);
            imageObjectUrlRef.current = url;
            setPreviewImage(url || storeData?.image || null);
        }
        if (type === "logo") {
            if (logoObjectUrlRef.current) URL.revokeObjectURL(logoObjectUrlRef.current);
            logoObjectUrlRef.current = url;
            setPreviewLogo(url || storeData?.logo || null);
        }
    };

    useEffect(() => {
        return () => {
            if (imageObjectUrlRef.current) URL.revokeObjectURL(imageObjectUrlRef.current);
            if (logoObjectUrlRef.current) URL.revokeObjectURL(logoObjectUrlRef.current);
        };
    }, []);

    /** -----------------------------------------
     * Eliminar imagen + limpiar FilePond
     * ---------------------------------------- */
    const removePicture = (type) => {
        if (type === "image") {
            setPreviewImage(null);
            setPendingImageFile(null);
            imagePondRef.current?.removeFiles();
        }
        if (type === "logo") {
            setPreviewLogo(null);
            setPendingLogoFile(null);
            logoPondRef.current?.removeFiles();
        }
    };

    /** -----------------------------------------
     * Guardar edición del crop
     * ---------------------------------------- */
    const handleSaveEdit = (blob) => {
        if (!blob || !editorType) return;

        const newFile = new File(
            [blob],
            `${Date.now()}-${editorType === "logo" ? "logo" : "featured"}.jpg`,
            {
                type: "image/jpeg",
                lastModified: Date.now(),
            }
        );

        if (editorType === "image") {
            setPendingImageFile(newFile);
            setPreviewFromFile(newFile, "image");
            // Reemplazar en FilePond
            imagePondRef.current?.removeFiles();
            isAddingFromEditor.current = true; // Marcar que viene del editor
            imagePondRef.current?.addFile(newFile);
        } else if (editorType === "logo") {
            setPendingLogoFile(newFile);
            setPreviewFromFile(newFile, "logo");
            // Reemplazar en FilePond
            logoPondRef.current?.removeFiles();
            isAddingFromEditor.current = true; // Marcar que viene del editor
            logoPondRef.current?.addFile(newFile);
        }

        setEditorFile(null);
        setEditorType(null);
    };

    /** -----------------------------------------
     * Guardar cambios en contexto
     * ---------------------------------------- */
    const handleSaveChanges = async () => {
        if (!storeData?._id) return;
        setIsSaving(true);
        try {
            if (!pendingImageFile && !pendingLogoFile) {
                addToast({
                    title: "Sin cambios",
                    color: "warning",
                });
                return;
            }

            let nextImageUrl = null;
            let nextLogoUrl = null;

            if (pendingImageFile) {
                const result = await uploadStoreImage(pendingImageFile, storeData._id, false);
                nextImageUrl = result?.url || null;
            }

            if (pendingLogoFile) {
                const result = await uploadStoreImage(pendingLogoFile, storeData._id, true);
                nextLogoUrl = result?.url || null;
            }

            setStoreData((prev) => ({
                ...prev,
                ...(nextImageUrl ? { image: nextImageUrl } : {}),
                ...(nextLogoUrl ? { logo: nextLogoUrl } : {}),
            }));

            if (nextImageUrl) setPreviewImage(nextImageUrl);
            if (nextLogoUrl) setPreviewLogo(nextLogoUrl);
            setPendingImageFile(null);
            setPendingLogoFile(null);

            addToast({
                title: "Imágenes actualizadas",
                color: "success",
            });
        } catch {
            addToast({
                title: "Error guardando",
                color: "danger",
            });
        } finally {
            setIsSaving(false);
        }
    };

    /** -----------------------------------------
     * COMPONENTE
     * ---------------------------------------- */
    return (
        <>
            <Motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-4"
            >
                {/* Vista previa del ListElement */}
                <Card className="border-1 border-primary-200 bg-primary-50/50">
                    <CardBody>
                        <h3 className="font-semibold text-lg">Vista previa</h3>
                        <div className="flex justify-center pt-4 max-w-sm mx-auto">
                            <ListElement
                                item={{
                                    _id: "preview",
                                    name: storeData?.name ?? "Tu tienda",
                                    description: storeData?.description ?? "",
                                    image:
                                        previewImage ??
                                        "https://via.placeholder.com/200?text=Tienda",
                                    logo:
                                        previewLogo ??
                                        "https://via.placeholder.com/60?text=Logo",
                                    slug: storeData?.slug ?? "tienda",
                                    categories: storeData?.categories ?? [],
                                }}
                                type="store"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Grid imágenes */}

                {/* Imagen destacada */}
                <Card>
                    <CardBody>
                        <h3 className="font-semibold mb-2">Imagen destacada</h3>

                        {previewImage && (
                            <div className="relative mb-3">
                                <div className="w-40 h-40 mx-auto rounded overflow-hidden">
                                    <Image src={previewImage} className="w-full h-full object-cover" />
                                </div>

                                <Button
                                    isIconOnly
                                    className="absolute top-2 right-2 bg-danger text-white"
                                    onClick={() => removePicture("image")}
                                >
                                    <X />
                                </Button>
                            </div>
                        )}

                        <FilePond
                            ref={imagePondRef}
                            allowMultiple={false}
                            acceptedFileTypes={["image/*"]}
                            maxFileSize="5MB"
                            instantUpload={false}
                            allowProcess={false}
                            onaddfile={(error, fileItem) => {
                                if (!error && fileItem.file) {
                                    // Solo abrir editor si NO viene del editor
                                    if (isAddingFromEditor.current) {
                                        isAddingFromEditor.current = false;
                                        return;
                                    }
                                    // Abrir editor con el archivo
                                    setEditorFile(fileItem.file);
                                    setEditorType("image");
                                }
                            }}
                            onupdatefiles={(items) => {
                                // Solo actualizar si no hay editor abierto
                                if (!editorFile) {
                                    const file = items?.[0]?.file || null;
                                    setPendingImageFile(file);
                                    setPreviewFromFile(file, "image");
                                }
                            }}
                        />
                        <div className="mt-4 p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                            <h4 className="text-xs font-semibold text-blue-900 mb-2">Especificaciones</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Tamaño:</span>
                                    <span>800x600px mín.</span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Peso:</span>
                                    <span>Hasta 5MB</span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Formato:</span>
                                    <span>JPG, PNG, WebP</span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Aspecto:</span>
                                    <span>4:3 recomendado</span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Logo */}
                <Card>
                    <CardBody>
                        <h3 className="font-semibold mb-2">Logo</h3>

                        {previewLogo && (
                            <div className="relative mb-3">
                                <div className="w-28 h-28 mx-auto rounded overflow-hidden">
                                    <Image src={previewLogo} className="w-full h-full object-cover" />
                                </div>

                                <Button
                                    isIconOnly
                                    className="absolute top-2 right-2 bg-danger text-white"
                                    onClick={() => removePicture("logo")}
                                >
                                    <X />
                                </Button>
                            </div>
                        )}

                        <FilePond
                            ref={logoPondRef}
                            allowMultiple={false}
                            acceptedFileTypes={["image/*"]}
                            maxFileSize="2MB"
                            instantUpload={false}
                            allowProcess={false}
                            onaddfile={(error, fileItem) => {
                                if (!error && fileItem.file) {
                                    // Solo abrir editor si NO viene del editor
                                    if (isAddingFromEditor.current) {
                                        isAddingFromEditor.current = false;
                                        return;
                                    }
                                    // Abrir editor con el archivo
                                    setEditorFile(fileItem.file);
                                    setEditorType("logo");
                                }
                            }}
                            onupdatefiles={(items) => {
                                // Solo actualizar si no hay editor abierto
                                if (!editorFile) {
                                    const file = items?.[0]?.file || null;
                                    setPendingLogoFile(file);
                                    setPreviewFromFile(file, "logo");
                                }
                            }}
                        />
                        <div className="mt-4 p-3 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                            <h4 className="text-xs font-semibold text-purple-900 mb-2">Especificaciones</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-purple-800">
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Tamaño:</span>
                                    <span>500x500px</span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Peso:</span>
                                    <span>Hasta 2MB </span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Formato:</span>
                                    <span>PNG, JPG, WebP</span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold min-w-fit">Aspecto:</span>
                                    <span>Cuadrado (1:1)</span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>



            </Motion.section>
            <div className="my-4 flex justify-center" >
                <Button
                    color="primary"
                    startContent={<Save />}
                    onClick={handleSaveChanges}
                    isLoading={isSaving}
                >
                    {isSaving ? "Subiendo..." : "Subir imágenes"}
                </Button>
            </div>

            {/* Modal de edición */}
            {editorFile && editorType && (
                <ImageEditorModal
                    file={editorFile}
                    onClose={() => {
                        // Cancelar: limpiar el FilePond correspondiente
                        if (editorType === "image") {
                            imagePondRef.current?.removeFiles();
                        } else if (editorType === "logo") {
                            logoPondRef.current?.removeFiles();
                        }
                        setEditorFile(null);
                        setEditorType(null);
                    }}
                    onSave={handleSaveEdit}
                    imagePreset={IMAGE_PRESETS[editorType === "logo" ? "logo" : "featured"]}
                />
            )}
        </>
    );
}
