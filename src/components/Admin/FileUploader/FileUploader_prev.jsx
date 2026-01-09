import { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";

import ImageEditorModal from "../../Admin/ImageEditorModal/ImageEditorModal";

// Plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// CSS
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./FileUploader.css";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

export default function FileUploader({ images, setImages, imageSizePreset }) {
  const pondRef = useRef(null);
  const [editorFile, setEditorFile] = useState(null); // File para editar
  const [currentItem, setCurrentItem] = useState(null); // FilePond fileItem

  const SIZE_PRESETS = {
    square: {
      label: "Cuadrada",
      minWidth: 800,
      minHeight: 800,
      aspectRatio: 1,
    },
    product: {
      label: "Producto",
      minWidth: 800,
      minHeight: 600,
      aspectRatio: 5 / 4,
    },
    hero: {
      label: "Hero",
      minWidth: 1600,
      minHeight: 900,
      aspectRatio: 16 / 9,
    },
  };

  const activePreset = SIZE_PRESETS[imageSizePreset] || SIZE_PRESETS.square;

  const lastOrderRef = useRef([]);

  const hasOrderChanged = (images) => {
    const ids = images.map((img) => img.id);
    const last = lastOrderRef.current;

    if (ids.length !== last.length) return true;

    return ids.some((id, i) => id !== last[i]);
  };

  // Convertir imagen remota a File antes de abrir editor
  const fetchRemoteFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename || "remote.jpg", { type: blob.type });
  };

  const syncImagesFromFilePond = (fileItems) => {
    if (!fileItems) return;

    setImages((prev) => {
      // liberar previews blob antiguos
      prev.forEach((img) => {
        if (img.preview && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });

      return fileItems.map((item) => {
        let preview = null;

        if (item.file instanceof File) {
          preview = URL.createObjectURL(item.file);
        } else if (typeof item.source === "string") {
          preview = item.source;
        }

        return {
          id: item.id,
          file: item.file instanceof File ? item.file : null,
          source: typeof item.source === "string" ? item.source : null,
          preview,
        };
      });
    });
  };

  // Activar editor desde miniatura externa (cuando el usuario pulsa "Editar" de la lista)
  const handleActivateFromPreview = async (file, source) => {
    if (!pondRef.current) return;

    let fileObj = file;

    // Si es remoto, convertir URL a File
    if (!fileObj && source) {
      fileObj = await fetchRemoteFile(source); // esto devuelve un File
    }

    // si no hay fileObj, salir antes de acceder a .name
    if (!fileObj) return;

    const pondFiles = pondRef.current.getFiles();
    const fileItem =
      pondFiles.find((f) => f.file === fileObj) ||
      pondFiles.find(
        (f) => f.file?.name === fileObj.name && f.file?.size === fileObj.size // fallback local
      ) ||
      pondFiles.find((f) => f.source === source); // <-- búsqueda remota

    if (!fileItem) return;

    setCurrentItem(fileItem);
    setEditorFile(fileObj);
  };

  // Guardar edición: actualizar el File en images
  const handleSaveEdit = (blob) => {
    if (!currentItem || !blob) return;

    const newFile = new File([blob], currentItem.file?.name || "edited.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    setImages((prev) =>
      prev.map((img) =>
        img.id === currentItem.id
          ? {
              ...img,
              file: newFile, // ⬅ ahora ES LOCAL
              source: null, // ⬅ deja de ser remoto
              replaces: img.source, // URL antigua
              preview: URL.createObjectURL(newFile),
            }
          : img
      )
    );

    setEditorFile(null);
    setCurrentItem(null);
  };

  // Detectar si el orden ha cambiado respecto al render anterior
  const orderChanged = hasOrderChanged(images);
  // Guardamos el orden actual para la próxima comparación
  lastOrderRef.current = images.map((img) => img.id);

  return (
    <div className="my-4">
      <label className="mb-2 block font-medium">Imágenes del producto</label>

      <FilePond
        ref={pondRef}
        files={images
          .map((img) =>
            img.file instanceof File
              ? img.file
              : img.source
              ? { source: img.source, options: { type: "remote" } }
              : null
          )
          .filter(Boolean)}
        allowMultiple={true}
        allowReorder={true}
        allowImagePreview={true}
        imagePreviewHeight={150}
        maxFiles={10}
        acceptedFileTypes={["image/*"]}
        labelIdle='Arrastra imágenes o <span className="filepond--label-action">explora</span>'
        allowFileSizeValidation={true}
        maxFileSize="8MB"
        onupdatefiles={syncImagesFromFilePond}
        onremovefile={syncImagesFromFilePond}
        onreorderfiles={syncImagesFromFilePond}
      />

      {/* Miniaturas externas con botón Editar (más robusto que inyectar en DOM de FilePond) */}
      <motion.div className="mt-4 grid grid-cols-4 gap-3">
        <AnimatePresence initial={false}>
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              layout={orderChanged} // ⬅️ SOLO anima si hay reorder
              initial={false} // ⬅️ evita animaciones innecesarias
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative border rounded overflow-hidden bg-gray-100"
              style={{
                aspectRatio: activePreset.aspectRatio,
              }}
            >
              {/* Número de orden */}
              <div className="absolute top-1 left-1 z-10 bg-primary bg-opacity/70 text-white text-xs px-2 py-0.5 rounded">
                {index + 1}
              </div>

              <img
                src={
                  img.preview ||
                  (img.file instanceof File
                    ? URL.createObjectURL(img.file)
                    : "")
                }
                alt="thumb"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-2 py-0 outline-0 h-8 rounded cursor-pointer"
                onPress={(e) => {
                  handleActivateFromPreview(img.file, img.source);
                }}
              >
                EDITAR
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal de edición */}
      {editorFile && (
        <ImageEditorModal
          file={editorFile}
          onClose={() => {
            setEditorFile(null);
            setCurrentItem(null);
          }}
          onSave={handleSaveEdit}
          imagePreset={SIZE_PRESETS[imageSizePreset] || SIZE_PRESETS["square"]}
        />
      )}
    </div>
  );
}
