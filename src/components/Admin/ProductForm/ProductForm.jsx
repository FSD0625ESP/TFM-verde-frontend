import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Camera,
  Save,
  Plus,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Checkbox,
  addToast,
} from "@heroui/react";

import FileUploader from "../FileUploader/FileUploader";
import { uploadProductImage, createProduct } from "../../../services/api";
import slugify from "slugify";

export default function ProductForm({
  product = null,
  categoriesList = [],
  submitLabel = "Guardar producto",
}) {
  const { storeCategoriesList } = useOutletContext();

  categoriesList = storeCategoriesList;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    status: "onSale",
    nuevo: false,
    oferta: false,
    destacado: false,
    categories: [], // array of ids (strings)
    active: true,
  });

  const [productImages, setProductImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    setFormData({
      title: product.title ?? "",
      description: product.description ?? "",
      price: product.price != null ? String(product.price) : "",
      stock: product.stock != null ? String(product.stock) : "",
      status: product.status ?? "onSale",
      nuevo: !!product.nuevo,
      oferta: !!product.oferta,
      destacado: !!product.destacado,
      categories: Array.isArray(product.categories)
        ? product.categories.map((c) => String(c))
        : [],
      active: product.deletedAt ? false : true,
    });
    /* 
    if (Array.isArray(product.images)) {
      setProductImages(
        product.images.map((url, i) => ({
          id: `existing-${i}`,
          file: null,
          url: null,
          preview: url,
          uploading: false,
        }))
      );
    }
     */
  }, [product]);

  const setField = (k, v) => setFormData((s) => ({ ...s, [k]: v }));

  const generateSlug = (text) => {
    if (!text) return "";

    return slugify(text, {
      lower: true, // convierte a minúsculas
      strict: true, // elimina caracteres especiales
      locale: "es", // soporte para tildes y ñ
      trim: true,
    });
  };
  /* validation helpers for heroui Input.validate prop */
  const validateTitle = (v) => {
    if (!v || v.trim().length < 1) return "Título requerido";
    return true;
  };
  const validateDescription = (v) => {
    if (!v || v.trim().length < 1) return "Descripción requerida";
    return true;
  };

  const validateLongDescription = (v) => {
    if (!v || v.trim().length < 1) return "Descripción detallada requerida";
    return true;
  };
  const validatePrice = (v) => {
    if (v === "" || v == null) return true; // price optional
    if (isNaN(Number(v)) || Number(v) < 0) return "Precio inválido";
    return true;
  };
  const validateStock = (v) => {
    if (v === "" || v == null) return "Stock requerido";
    if (!Number.isFinite(Number(v)) || Number(v) < 0) return "Stock inválido";
    return true;
  };

  const validateCategories = (v) => {
    if (!v || v.length === 0) return "Selecciona al menos una categoría";
    return true;
  };

  const validateImages = () => {
    if (productImages.length === 0) return "Selecciona al menos una imagen";
    return true;
  };

  const handleTitleChange = (v) => {
    // v is value from Input onChange (heroui passes event for Input, but we keep event style)
    // Accept either event or string
    const value = typeof v === "string" ? v : v.target?.value;
    setField("title", value);
    // auto-generate slug only if slug is empty or matches previous generated
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      setField("slug", generateSlug(value));
    }
  };

  const validateFormBeforeSubmit = () => {
    // run the small validation set, show toasts for issues
    const titleOk = validateTitle(formData.title) === true;
    const descOk = validateDescription(formData.description) === true;
    const longDescOk =
      validateLongDescription(formData.longDescription) === true;
    const categoriesOk = validateCategories(formData.categories) === true;
    const priceOk = validatePrice(formData.price) === true;
    const stockOk = validateStock(formData.stock) === true;
    const imagesOk = validateImages(productImages) === true;

    if (!titleOk) {
      addToast({
        title: "Validación",
        description: validateTitle(formData.title),
        color: "danger",
      });
      return false;
    }
    if (!descOk) {
      addToast({
        title: "Validación",
        description: validateDescription(formData.description),
        color: "danger",
      });
      return false;
    }
    if (!longDescOk) {
      addToast({
        title: "Validación",
        description: validateLongDescription(formData.longDescription),
        color: "danger",
      });
      return false;
    }
    if (!categoriesOk) {
      addToast({
        title: "Validación",
        description: validateCategories(formData.categories),
        color: "danger",
      });
      return false;
    }
    if (!priceOk) {
      addToast({
        title: "Validación",
        description: validatePrice(formData.price),
        color: "danger",
      });
      return false;
    }
    if (!stockOk) {
      addToast({
        title: "Validación",
        description: validateStock(formData.stock),
        color: "danger",
      });
      return false;
    }
    if (!imagesOk) {
      addToast({
        title: "Validación",
        description: "Añade al menos una imagen",
        color: "danger",
      });
      return false;
    }
    if (productImages.some((i) => i.uploading)) {
      addToast({
        title: "Subida de imágenes",
        description: "Espera a que terminen las subidas",
        color: "warning",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateFormBeforeSubmit()) return;
    let payload = {
      title: formData.title,
      description: formData.description,
      longDescription: formData.longDescription,
      price: Number(formData.price),
      status: formData.status,
      oferta: !!formData.oferta,
      destacado: !!formData.destacado,
      stock: Number(formData.stock),
      categories: formData.categories.split(",").map((cat) => cat.trim()),
      active: !!formData.active,
    };
    console.log("FORMDATA", payload);

    try {
      setSubmitting(true);
      const productData = await createProduct(payload);
      console.log("Producto creado:", productData);
      await uploadImages(productData.productId);
      //await onSubmit(payload);
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: err?.message || "Error al guardar producto",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const uploadImages = async (productId) => {
    try {
      if (!productId) throw new Error("ID de producto no válido");

      // Filtramos solo los que tengan un File real
      const files = productImages
        .map((img) => img.file)
        .filter((f) => f instanceof File);

      if (!files.length) {
        addToast({
          title: "Imágenes",
          description: "No hay nuevas imágenes para subir",
          color: "warning",
        });
        return;
      }

      for (const file of files) {
        await uploadProductImage(file, productId);
      }

      addToast({
        title: "Éxito",
        description: "Producto creado y imágenes subidas correctamente",
        color: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: err?.message || "Error al subir imágenes",
        color: "danger",
      });
    }
  };

  const inputStyleProps = {
    variant: "flat",
    classNames: {
      inputWrapper:
        "border border-gray-200 bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
      input: "bg-white",
    },
  };

  return (
    <>
      <h3 class="text-xl font-semibold mb-2">Añadir Nuevo Producto</h3>
      <p class="text-gray-700">
        Rellena el siguiente formulario para añadir un nuevo producto
      </p>
      <form onSubmit={handleSubmit} className="product-form pt-3 ">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-4 mt-4 mb-6">
            {/* 
            <div>
              <Checkbox
                isSelected={!!formData.active}
                onChange={(e) => setField("active", e.target.checked)}
                color="primary"
              >
                Activo
              </Checkbox>
            </div>
 */}
            <Input
              label="Nombre"
              placeholder="Nombre del producto"
              value={formData.title}
              onChange={handleTitleChange}
              validate={validateTitle}
              isRequired
              {...inputStyleProps}
            />
            <Textarea
              label="Descripción"
              placeholder="Descripción breve"
              value={formData.description}
              onChange={(e) => setField("description", e.target.value)}
              validate={validateDescription}
              isRequired
              {...inputStyleProps}
            />
            <Textarea
              label="Descripción Detallada"
              placeholder="Descripción completa"
              value={formData.longDescription}
              onChange={(e) => setField("longDescription", e.target.value)}
              validate={validateLongDescription}
              isRequired
              {...inputStyleProps}
            />
            <Input
              label="Precio"
              placeholder="0.00"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setField("price", e.target.value)}
              validate={validatePrice}
              isRequired
              {...inputStyleProps}
            />
            <Input
              label="Stock"
              placeholder="Cantidad"
              type="number"
              value={formData.stock}
              onChange={(e) => setField("stock", e.target.value)}
              validate={validateStock}
              isRequired
              {...inputStyleProps}
            />
            <Select
              label="Categoría"
              placeholder="Seleccionar categoría"
              value={formData.categories}
              onChange={(e) => {
                setField("categories", e.target.value);
                console.log("Selected categories:", e.target.value);
              }}
              className="mt-2"
              selectionMode="multiple"
              validate={validateCategories}
              isRequired
            >
              {categoriesList.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Estado"
              placeholder="Estado del producto en la tienda"
              value={formData.status}
              onChange={(e) => {
                setField("status", e.target.value);
              }}
              className="mt-2"
              isRequired
            >
              <SelectItem key="onSale" value="onSale">
                En venta
              </SelectItem>
              <SelectItem key="exhibition" value="exhibition">
                Exhibición
              </SelectItem>
              <SelectItem key="disabled" value="disabled">
                Deshabilitado
              </SelectItem>
            </Select>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div className="block font-medium">
              Características del producto
            </div>
            <Checkbox
              isSelected={!!formData.oferta}
              onChange={(e) => setField("oferta", e.target.checked)}
            >
              Oferta
            </Checkbox>
            <Checkbox
              isSelected={!!formData.destacado}
              onChange={(e) => setField("destacado", e.target.checked)}
            >
              Destacado
            </Checkbox>
            <FileUploader images={productImages} setImages={setProductImages} />
          </div>
        </div>

        <div className="actions w-full flex justify-center">
          <Button type="submit" disabled={submitting} icon={<Save size={14} />}>
            {submitting ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
}
