import { useEffect, useState } from "react";
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
import axios from "axios";

import slugify from "slugify";
import { longFormatters } from "date-fns";

/*
 ProductForm.jsx
 Props:
        - product: objeto opcional (coincide con el esquema mongoose proporcionado)
        - onSubmit: función async(payload)
        - categories: array de { value, label } para seleccionar (multiple)
        - submitLabel: texto botón
*/

export default function ProductForm({
  product = null,
  onSubmit,
  allCategories = [],
  submitLabel = "Guardar producto",
}) {
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

  const handleCategoriesChange = (e) => {
    console.log("selected category", e.target.value);
    setField("categories", e.target.value);
  };

  const validateCategories = (v) => {
    if (!v || v.length === 0) return "Selecciona al menos una categoría";
    return true;
  };

  const validateImages = (v) => {
    if (productImages.length === 0) return "Selecciona al menos una imagen";
    return true;
  };

  const handleTitleChange = (v) => {
    // v is value from Input onChange (heroui passes event for Input, but we keep event style)
    // Accept either event or string
    const value = typeof v === "string" ? v : v.target?.value;
    setField("title", value);
    // auto-generate slug only if slug is empty or matches previous generated
    if (!form.slug || form.slug === generateSlug(form.title)) {
      setField("slug", generateSlug(value));
    }
  };

  const validateFormBeforeSubmit = () => {
    // run the small validation set, show toasts for issues
    const titleOk = validateTitle(form.title) === true;
    const descOk = validateDescription(form.description) === true;
    const longDescOk = validateLongDescription(form.longDescription) === true;
    const categoriesOk = validateCategories(form.categories) === true;
    const priceOk = validatePrice(form.price) === true;
    const stockOk = validateStock(form.stock) === true;
    const imagesOk = validateImages(productImages) === true;

    if (!titleOk) {
      addToast({
        title: "Validación",
        description: validateTitle(form.title),
        color: "danger",
      });
      return false;
    }
    if (!descOk) {
      addToast({
        title: "Validación",
        description: validateDescription(form.description),
        color: "danger",
      });
      return false;
    }
    if (!longDescOk) {
      addToast({
        title: "Validación",
        description: validateLongDescription(form.longDescription),
        color: "danger",
      });
      return false;
    }
    if (!categoriesOk) {
      addToast({
        title: "Validación",
        description: validateCategories(form.categories),
        color: "danger",
      });
      return false;
    }
    if (!priceOk) {
      addToast({
        title: "Validación",
        description: validatePrice(form.price),
        color: "danger",
      });
      return false;
    }
    if (!stockOk) {
      addToast({
        title: "Validación",
        description: validateStock(form.stock),
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
      nuevo: !!formData.nuevo,
      oferta: !!formData.oferta,
      destacado: !!formData.destacado,
      stock: Number(formData.stock),
      categories: formData.categories,
      // storeId / deletedAt / timestamps handled server-side
      active: !!formData.active,
    };

    // Solo guardamos las URLs definitivas de Cloudinary
    const imageUrls = productImages.map((img) => img.url).filter(Boolean);

    payload = {
      ...payload,
      images: imageUrls,
    };

    try {
      setSubmitting(true);
      console.log("ProductForm handleSubmit payload", payload);
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

  const inputStyleProps = {
    variant: "flat",
    classNames: {
      inputWrapper:
        "border border-gray-200 bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
      input: "bg-white",
    },
  };

  return (
    <form onSubmit={handleSubmit} className="product-form space-y-4 ">
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-4 mt-4 mb-6">
          <div>
            <Checkbox
              isSelected={!!formData.active}
              onChange={(e) => setField("active", e.target.checked)}
              color="primary"
            >
              Activo
            </Checkbox>
          </div>
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
            onChange={handleCategoriesChange}
            className="mt-2"
            validate={validateCategories}
            isRequired
          >
            {allCategories.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Estado"
            placeholder="Producto en venta o exhibición"
            value={formData.status}
            onChange={(e) => setField("status", e.target.value)}
            className="mt-2"
            isRequired
          >
            <SelectItem value="onSale">En venta</SelectItem>
            <SelectItem value="exhibition">Exhibición</SelectItem>
          </Select>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="block font-medium">Características del producto</div>
          <Checkbox
            isSelected={!!formData.nuevo}
            onChange={(e) => setField("nuevo", e.target.checked)}
          >
            Nuevo
          </Checkbox>
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
  );
}
