import { useRef, useState, useEffect, useImperativeHandle } from "react";
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
import { Divide } from "lucide-react";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

/**
 * FileUploader mantiene su propio estado interno (localImages)
 * y expone métodos al padre mediante ref (React 19 style).
 */
export default function FileUploader({ images = [], imageSizePreset, ref }) {
  const pondRef = useRef(null);
  const [editorFile, setEditorFile] = useState(null); // File para editar
  const [currentItem, setCurrentItem] = useState(null); // FilePond fileItem
  const [localImages, setLocalImages] = useState([]); // Estado local para imágenes

  // Inicializar estado interno SOLO cuando cambian las imágenes iniciales
  useEffect(() => {
    setLocalImages(
      (images ?? []).map((img) => ({
        ...img,
        stableId: img.public_id || crypto.randomUUID(),
      }))
    );
  }, [images]);

  // Exponer método al padre
  useImperativeHandle(ref, () => ({
    getImages: () => localImages.map(({ stableId, ...img }) => img),
    reset: () => {
      setLocalImages(images ?? []);
      pondRef.current?.removeFiles();
    },
  }));

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

  // Sincronizar imágenes de FilePond con estado localImages
  const syncImagesFromFilePond = (fileItems) => {
    if (!fileItems) return;

    setLocalImages((prev) => {
      return fileItems.map((item) => {
        // BUSCAR SI YA EXISTÍA ESTA IMAGEN
        const existing = prev.find((img) => {
          if (img.public_id && item.source === img.source) return true;
          if (img.file && item.file && img.file === item.file) return true;
          return false;
        });

        return {
          stableId: existing?.stableId ?? crypto.randomUUID(),
          file: item.file instanceof File ? item.file : null,
          source: typeof item.source === "string" ? item.source : null,
          preview:
            item.file instanceof File
              ? URL.createObjectURL(item.file)
              : item.source,
          public_id: existing?.public_id ?? null, // ✅ NUNCA SE PIERDE
          replaces: existing?.replaces ?? null,
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

    const newFile = new File(
      [blob],
      `${Date.now()}-${currentItem.file?.name || "edited.jpg"}`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );

    setLocalImages((prev) =>
      prev.map((img) => {
        const isSameByPublicId =
          img.public_id && img.public_id === currentItem.metadata?.public_id;

        const isSameLocalFile =
          img.file && currentItem.file && img.file === currentItem.file;

        if (isSameByPublicId || isSameLocalFile) {
          return {
            ...img,
            file: newFile, // ⬅️ nuevo File (clave)
            source: null, // deja de ser remota
            replaces: img.public_id ?? img.replaces ?? null,
            preview: URL.createObjectURL(newFile),
          };
        }

        return img;
      })
    );

    setEditorFile(null);
    setCurrentItem(null);
  };

  // Detectar si el orden ha cambiado respecto al render anterior
  const orderChanged = hasOrderChanged(localImages);
  // Guardamos el orden actual para la próxima comparación
  lastOrderRef.current = localImages.map((img) => img.id);

  return (
    <div className="my-4">
      <label className="mb-2 block font-medium">Imágenes del producto</label>

      <FilePond
        ref={pondRef}
        files={localImages
          .map((img) => {
            // Imagen local (nueva o editada)
            if (img.file instanceof File) {
              return {
                source: img.file,
                options: {
                  type: "local",
                  metadata: {
                    public_id: img.public_id ?? null, // conservar si existe
                  },
                },
              };
            }

            // Imagen remota (ya guardada en Cloudinary)
            if (img.source) {
              return {
                source: img.source,
                options: {
                  type: "remote",
                  metadata: {
                    public_id: img.public_id ?? null, // conservar si existe
                  },
                },
              };
            }

            return null;
          })
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
          {localImages.map((img, index) => {
            const isEdited = Boolean(img.replaces);
            const isNew =
              img.file instanceof File && !img.public_id && !img.replaces;

            return (
              <motion.div
                key={img.stableId}
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

                {/* Badge EDITADA */}
                {isEdited && (
                  <div className="absolute top-1 right-1 z-10 bg-warning text-black text-[10px] px-2 py-0.5 rounded font-semibold">
                    EDITADA
                  </div>
                )}

                {/* Badge NUEVA */}
                {isNew && (
                  <div className="absolute top-1 right-1 z-20 bg-success text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                    NUEVA
                  </div>
                )}

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
                {/* Botón EDITAR - solo visible para imágenes nuevas ya que las remotas NO son editables (futura funcionalidad) */}
                {isNew && (
                  <Button
                    type="button"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-2 py-0 outline-0 h-8 rounded cursor-pointer"
                    onPress={(e) => {
                      handleActivateFromPreview(img.file, img.source);
                    }}
                  >
                    EDITAR
                  </Button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="pt-4 text-center text-xs text-danger-500">
        NOTA: Solo se pueden editar las imágenes nuevas
      </div>

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
