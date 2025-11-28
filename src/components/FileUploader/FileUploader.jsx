import { useEffect, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import { uploadProductImage } from "../../services/api";

// Plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

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

/*
props:
- images: estado del ProductForm
- setImages: setter del ProductForm
*/

export default function FileUploader({ images, setImages }) {
  const pondRef = useRef();

  // Cuando FilePond cambia sus archivos, se llama a handleUpdateFiles
  const handleUpdateFiles = (fileItems) => {
    const mapped = fileItems.map((item) => ({
      id: item.id,
      file: item.file ?? null, // archivo real para subir
      url: item.serverId ?? null, // <--- Cloudinary URL después de subir
      preview: item?.file ? URL.createObjectURL(item.file) : item.serverId, // preview local o URL existente
    }));

    setImages(mapped);
    console.log("FileUploader handleUpdateFiles mapped", mapped);
    console.log("FileUploader handleUpdateFiles images", images);
  };

  return (
    <div className="my-4">
      <label className="mb-2 block font-medium">Imágenes del producto</label>

      <FilePond
        ref={pondRef}
        //files={images.map((img) => img.file || img)}
        files={images.map((img) => img.file ?? img)}
        allowMultiple={true}
        allowReorder={true}
        allowImagePreview={true}
        imagePreviewWidth={120}
        maxFiles={10}
        onupdatefiles={handleUpdateFiles}
        onremovefile={handleUpdateFiles}
        acceptedFileTypes={["image/*"]}
        labelIdle='Arrastra imágenes o <span class="filepond--label-action">explora</span>'
        allowFileSizeValidation={true}
        maxFileSize="5MB"
        server={{
          process: {
            url: "http://localhost:5173/api/uploads/product/image",
            method: "POST",
            withCredentials: false,
            onload: (res) => {
              const data = JSON.parse(res);
              return data.url; // <--- Cloudinary URL
            },
          },
          revert: null,
        }}
      />
    </div>
  );
}
