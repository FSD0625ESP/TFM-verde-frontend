import React, { useEffect, useState } from "react";
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

/*
 ProductForm.jsx
 Props:
        - product: objeto opcional (coincide con el esquema mongoose proporcionado)
        - onSubmit: función async(payload)
        - categories: array de { value, label } para seleccionar (multiple)
        - submitLabel: texto botón
 Configurar CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET abajo
*/

const CLOUDINARY_CLOUD_NAME = "dewtxnagu";
const CLOUDINARY_UPLOAD_PRESET = "<tfm-meraki>";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function ProductForm({
  product = null,
  onSubmit,
  categories = [],
  submitLabel = "Guardar producto",
}) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
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

  // images: [{ file?, preview, url?, uploading?, id }]
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    setForm({
      title: product.title ?? "",
      slug: product.slug ?? "",
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

    if (Array.isArray(product.images)) {
      setImages(
        product.images.map((url, i) => ({
          id: `existing-${i}`,
          preview: url,
          url,
          uploading: false,
        }))
      );
    }
  }, [product]);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const generateSlug = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  /* validation helpers for heroui Input.validate prop */
  const validateTitle = (v) => {
    if (!v || v.trim().length < 2) return "Título requerido (mín 2 caracteres)";
    return true;
  };
  const validateSlug = (v) => {
    if (!v || v.trim().length < 2) return "Slug requerido";
    return true;
  };
  const validateDescription = (v) => {
    if (!v || v.trim().length < 3)
      return "Descripción requerida (mín 3 caracteres)";
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

  const uploadToCloudinary = async (file) => {
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CLOUD_NAME.includes("<")) {
      throw new Error(
        "Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET"
      );
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary upload error: ${text}`);
    }
    const data = await res.json();
    return data.secure_url || data.url;
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const added = files.map((file, i) => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        preview,
        uploading: true,
        url: null,
        id: `local-${Date.now()}-${i}`,
      };
    });
    setImages((prev) => [...prev, ...added]);

    for (const item of added) {
      try {
        const uploadedUrl = await uploadToCloudinary(item.file);
        setImages((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, uploading: false, url: uploadedUrl } : p
          )
        );
      } catch (err) {
        console.error("Upload failed", err);
        addToast({
          title: "Error al subir imagen",
          description: err.message || "No se pudo subir la imagen",
          color: "danger",
        });
        setImages((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, uploading: false } : p))
        );
      }
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCategoriesChange = (e) => {
    const opts = Array.from(e.target.selectedOptions || []);
    const vals = opts.map((o) => o.value);
    setField("categories", vals);
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
    const slugOk = validateSlug(form.slug) === true;
    const descOk = validateDescription(form.description) === true;
    const stockOk = validateStock(form.stock) === true;
    const imagesOk = images.some((i) => i.url);

    if (!titleOk) {
      addToast({
        title: "Validación",
        description: validateTitle(form.title),
        color: "danger",
      });
      return false;
    }
    if (!slugOk) {
      addToast({
        title: "Validación",
        description: validateSlug(form.slug),
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
    if (images.some((i) => i.uploading)) {
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

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      price: form.price !== "" ? Number(form.price) : undefined,
      images: images.filter((i) => i.url).map((i) => i.url),
      status: form.status,
      nuevo: !!form.nuevo,
      oferta: !!form.oferta,
      destacado: !!form.destacado,
      stock: Number(form.stock),
      categories: form.categories,
      // storeId / deletedAt / timestamps handled server-side
      active: !!form.active,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
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
        "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
      input: "bg-white",
    },
  };

  return (
    <form onSubmit={handleSubmit} className="product-form space-y-4">
      <Input
        label="Título"
        placeholder="Título del producto"
        value={form.title}
        onChange={handleTitleChange}
        validate={validateTitle}
        isRequired
        icon={<ImageIcon size={16} />}
        {...inputStyleProps}
      />

      <Input
        label="Slug"
        placeholder="slug-del-producto"
        value={form.slug}
        onChange={(e) => setField("slug", e.target.value)}
        validate={validateSlug}
        isRequired
        icon={<LinkIcon size={14} />}
        {...inputStyleProps}
      />

      <Textarea
        label="Descripción"
        placeholder="Descripción completa"
        value={form.description}
        onChange={(e) => setField("description", e.target.value)}
        validate={validateDescription}
        isRequired
        {...inputStyleProps}
      />

      <div className="two-cols">
        <Input
          label="Precio"
          placeholder="0.00"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
          validate={validatePrice}
          icon={<Camera size={16} />}
          {...inputStyleProps}
        />

        <Input
          label="Stock"
          placeholder="Cantidad"
          type="number"
          value={form.stock}
          onChange={(e) => setField("stock", e.target.value)}
          validate={validateStock}
          isRequired
          {...inputStyleProps}
        />
      </div>

      <div className="two-cols">
        <div>
          Categorías
          <Select
            multiple
            value={form.categories}
            onChange={handleCategoriesChange}
            size={Math.min(6, Math.max(2, categories.length))}
            className="mt-2"
          >
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <Select
            label="Estado"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className="mt-2"
          >
            <SelectItem value="onSale">En venta</SelectItem>
            <SelectItem value="exhibition">Exhibición</SelectItem>
          </Select>

          <div className="flex gap-2 mt-3">
            <Checkbox
              isSelected={!!form.nuevo}
              onChange={(e) => setField("nuevo", e.target.checked)}
            >
              Nuevo
            </Checkbox>
            <Checkbox
              isSelected={!!form.oferta}
              onChange={(e) => setField("oferta", e.target.checked)}
            >
              Oferta
            </Checkbox>
            <Checkbox
              isSelected={!!form.destacado}
              onChange={(e) => setField("destacado", e.target.checked)}
            >
              Destacado
            </Checkbox>
          </div>
        </div>
      </div>

      {/* <div className="images-uploader">
        Imágenes
        <div className="mt-2">
          <Input onChange={(e) => handleFiles(e.target.files)} multiple>
            <Button type="button" icon={<Plus size={14} />}>
              Subir imágenes
            </Button>
          </Input>

          <Input
          label="Stock"
          placeholder="Cantidad"
          type="file"
          value={form.stock}
          onChange={(e) => setField("stock", e.target.value)}
          validate={validateStock}
          isRequired
          {...inputStyleProps}
        />

          <div className="thumbnails mt-3">
            {images.map((img) => (
              <div key={img.id} className="thumb">
                <img src={img.url || img.preview} alt="preview" />
                <div className="thumb-actions">
                  {img.uploading ? <small>Subiendo...</small> : null}
                  <Button
                    variant="ghost"
                    onClick={() => removeImage(img.id)}
                    icon={<Trash2 size={14} />}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <div>
        <Checkbox
          isSelected={!!form.active}
          onChange={(e) => setField("active", e.target.checked)}
          color="primary"
        >
          Activo
        </Checkbox>
      </div>

      <div className="actions">
        <Button type="submit" disabled={submitting} icon={<Save size={14} />}>
          {submitting ? "Guardando..." : submitLabel}
        </Button>
      </div>

      <style jsx>{`
        .product-form .two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .images-uploader .thumbnails {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .thumb {
          position: relative;
          width: 96px;
          height: 96px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-actions {
          position: absolute;
          top: 4px;
          right: 4px;
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.6);
          padding: 4px;
          border-radius: 6px;
          align-items: center;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </form>
  );
}
