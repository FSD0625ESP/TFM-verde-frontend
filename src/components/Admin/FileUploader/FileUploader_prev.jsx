import { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import ImageEditorModal from "../../Admin/ImageEditorModal/ImageEditorModal";

// Plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";

// CSS
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import "./FileUploader.css";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageEdit
);

export default function FileUploader({ images, setImages }) {
  const pondRef = useRef(null);
  const [editorFile, setEditorFile] = useState(null); // File para editar
  const [currentItem, setCurrentItem] = useState(null); // FilePond fileItem

  // Reemplaza un archivo en FilePond: eliminar y volver a añadir (fuerza regenerar thumbnail)
  const updateFileInPond = async (fileItem, newFile) => {
    const pond = pondRef.current;
    if (!pond) return;

    // Encuentra el índice del fileItem en pond
    const files = pond.getFiles(); // array de FilePond fileItems
    const idx = files.findIndex((f) => f.id === fileItem.id);
    if (idx === -1) return;

    // Guardar posición y metadata si quieres preservarlas (opcional)
    // 1) eliminar archivo antiguo
    await pond.removeFile(fileItem.id);

    // 2) añadir nuevo (type local para que se trate como archivo cliente)
    // addFile devuelve una promesa que se resuelve cuando FilePond ha procesado el archivo
    await pond.addFile(newFile, { type: "local" });

    // Nota: onupdatefiles se disparará y actualizará el estado 'images'
  };

  // Convertir imagen remota a File antes de abrir editor
  const fetchRemoteFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename || "remote.jpg", { type: blob.type });
  };

  // Actualiza estado images desde FilePond
  const handleUpdateFiles = (fileItems) => {
    const mapped = fileItems.map((item) => ({
      //id: item.id,
      //file: item.file || null,
      //preview: item.file ? URL.createObjectURL(item.file) : null,
      id: item.id,
      file: item.file instanceof File ? item.file : null,
      source: item.source || null,
      preview:
        item.source || (item.file ? URL.createObjectURL(item.file) : null),
    }));

    setImages(mapped);
    // console.log("handleUpdateFiles", mapped);
  };

  // Activar editor desde FilePond native (onactivatefile)
  const handleActivateFile = async (fileItem) => {
    if (!fileItem) return;

    let fileObj = fileItem.file;

    if (!fileObj && fileItem.source) {
      fileObj = await fetchRemoteFile(fileItem.source);
    }

    setCurrentItem(fileItem);
    setEditorFile(fileObj);
  };

  // Activar editor desde miniatura externa (cuando el usuario pulsa "Editar" de la lista)
  /* 
  const handleActivateFromPreview = (file) => {
    if (!pondRef.current) return;

    const pondFiles = pondRef.current.getFiles();
    const fileItem = pondFiles.find((f) => f.file === file);
    if (!fileItem) {
      // Si no encuentra por referencia, intenta por nombre/size como fallback
      const fallback = pondFiles.find(
        (f) => f.file?.name === file.name && f.file?.size === file.size
      );
      if (!fallback) return;
      setCurrentItem(fallback);
      setEditorFile(fallback.file);
      return;
    }

    setCurrentItem(fileItem);
    setEditorFile(fileItem.file);
  };
   */
  const handleActivateFromPreview = async (file, source) => {
    if (!pondRef.current) return;

    let fileObj = file;

    // Si es remoto, convertir URL a File
    if (!file && source) {
      fileObj = await fetchRemoteFile(source);
    }

    const pondFiles = pondRef.current.getFiles();
    const fileItem =
      pondFiles.find((f) => f.file === fileObj) ||
      pondFiles.find(
        (f) => f.file?.name === fileObj.name && f.file?.size === fileObj.size
      );

    if (!fileItem) return;

    setCurrentItem(fileItem);
    setEditorFile(fileObj);
  };

  // Guardar edición: recibimos blob desde modal -> convertimos a File y reemplazamos en FilePond
  const handleSaveEdit = async (blob) => {
    if (!currentItem || !blob) return;

    const newFile = new File([blob], currentItem.file?.name || "edited.jpg", {
      type: blob.type || "image/jpeg",
      lastModified: Date.now(),
    });

    // Reemplazamos dentro de FilePond (elimina + añade para forzar regenerado de miniatura)
    await updateFileInPond(currentItem, newFile);

    // Actualizamos estado React (images). onupdatefiles se disparará pero actualizamos para seguridad.
    setImages((prev) =>
      prev.map((img) =>
        img.id === currentItem.id
          ? { ...img, file: newFile, preview: URL.createObjectURL(newFile) }
          : img
      )
    );

    // Cerrar modal
    setEditorFile(null);
    setCurrentItem(null);
  };

  return (
    <div className="my-4">
      <label className="mb-2 block font-medium">Imágenes del producto</label>

      <FilePond
        ref={pondRef}
        //files={images.map((img) => img.file)} // pasar File[] directamente (mejor)
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
        labelIdle='Arrastra imágenes o <span class="filepond--label-action">explora</span>'
        allowFileSizeValidation={true}
        maxFileSize="5MB"
        allowImageEdit={true}
        imageEditInstantEdit={false}
        imageEditEditor={{
          open: (file, instructions, options) => {
            // file es el blob original del FilePond FileItem
            setEditorFile(file); // abre el modal
            setCurrentItem(options.file); // asigna el FileItem activo

            // FilePond espera una promesa; la dejamos pendiente hasta que guardes
            return new Promise(() => {});
          },
        }}
        onupdatefiles={handleUpdateFiles}
        onremovefile={handleUpdateFiles}
        onactivatefile={handleActivateFile}
      />

      {/* Miniaturas externas con botón Editar (más robusto que inyectar en DOM de FilePond) */}
      {images && images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative border rounded overflow-hidden"
            >
              <img
                src={
                  //img.preview ?? (img.file ? URL.createObjectURL(img.file) : "")
                  img.preview ||
                  (img.file instanceof File
                    ? URL.createObjectURL(img.file)
                    : "")
                }
                alt="thumb"
                className="w-full h-28 object-cover"
              />
              <button
                type="button"
                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-secondary bg-opacity-60 text-white text-xs px-2 py-1 rounded cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // NO ENVÍA FORMULARIO
                  e.stopPropagation(); // NO INTERFIERE CON FilePond
                  handleActivateFromPreview(img.file);
                }}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {editorFile && (
        <ImageEditorModal
          file={editorFile}
          onClose={() => {
            setEditorFile(null);
            setCurrentItem(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
