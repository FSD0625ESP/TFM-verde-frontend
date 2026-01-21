import { useEffect, useState, useMemo, useRef } from "react";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../../contexts/StoreContext";
import {
  Camera,
  Save,
  Plus,
  Image as ImageIcon,
  Trash2,
  Ban,
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
  Spinner,
} from "@heroui/react";

import FileUploader from "../FileUploader/FileUploader";
import {
  uploadProductImage,
  deleteProductImage,
  createProduct,
  updateProductById,
} from "../../../services/api";
import slugify from "slugify";

export default function ProductForm({
  product = null,
  categoriesList = [],
  submitLabel = "",
}) {
  // si se pasa un producto por url, se edita, si no se crea
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const uploaderRef = useRef(null);

  const {
    storeProducts,
    storeCategories,
    updateProduct,
    setStoreProductsList,
  } = useContext(StoreContext);

  // si se pasa un producto por url, se edita, si no se crea
  const resolvedProduct = useMemo(() => {
    if (product) return product;
    if (!productId) return null;
    return storeProducts.find((p) => p._id === productId) ?? null;
  }, [product, productId, storeProducts]);

  // estado inicial para hacer reset del formulario si no llega productId vía url
  const EMPTY_FORM = {
    title: "",
    description: "",
    longDescription: "",
    price: "",
    stock: "",
    status: "onSale",
    nuevo: false,
    oferta: false,
    destacado: false,
    categories: [],
    active: true,
  };

  submitLabel = productId ? "Guardar cambios" : "Guardar producto";

  categoriesList = storeCategories;

  const [formData, setFormData] = useState({
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

  const [productImages, setProductImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // estados para detectar cambios en textos e imágenes
  const [textDirty, setTextDirty] = useState(false);

  const setField = (k, v) => {
    setFormData((s) => ({ ...s, [k]: v }));
    setTextDirty(true);
  };

  const initialImagesRef = useRef([]);

  // si no hay productId, resetear todo
  useEffect(() => {
    if (!productId) {
      initialImagesRef.current = [];
      setFormData(EMPTY_FORM);
      setProductImages([]);
      setTextDirty(false);
      return;
    }
  }, [productId]);

  useEffect(() => {
    if (!resolvedProduct) return;

    initialImagesRef.current = resolvedProduct.images.map((img) => ({
      public_id: img.public_id,
      source: img.url,
    }));

    setProductImages(
      resolvedProduct.images.map((img, i) => ({
        id: `existing-${i}`,
        file: null,
        source: img.url,
        preview: img.url,
        public_id: img.public_id,
      }))
    );

    setTextDirty(false);
  }, [resolvedProduct]);

  // si se pasa un producto por url, se edita, si no se crea
  useEffect(() => {
    // MODO CREAR PRODUCTO
    if (!productId) {
      setFormData(EMPTY_FORM);
      setProductImages([]);

      return;
    }

    // MODO EDITAR PRODUCTO
    if (!resolvedProduct) return;

    setFormData({
      title: resolvedProduct.title ?? "",
      slug: resolvedProduct.slug ?? "",
      description: resolvedProduct.description ?? "",
      longDescription: resolvedProduct.longDescription ?? "",
      price: resolvedProduct.price != null ? String(resolvedProduct.price) : "",
      stock: resolvedProduct.stock != null ? String(resolvedProduct.stock) : "",
      status: resolvedProduct.status ?? "",
      nuevo: !!resolvedProduct.nuevo,
      oferta: !!resolvedProduct.oferta,
      destacado: !!resolvedProduct.destacado,
      categories: Array.isArray(resolvedProduct.categories)
        ? resolvedProduct.categories.map((c) =>
            typeof c === "string" ? c : c._id
          )
        : [],
      active: resolvedProduct.deletedAt ? false : true,
    });
  }, [productId, resolvedProduct]);

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
    //if (productImages.length === 0) return "Selecciona al menos una imagen";
    const finalImages = uploaderRef.current?.getImages() ?? [];
    if (finalImages.length === 0) return "Selecciona al menos una imagen";
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
    const imagesOk = validateImages() === true;

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

  // comparar imágenes iniciales con finales
  const imagesHaveChanged = (initial = [], final = []) => {
    const initialIds = initial.map((i) => i.public_id).sort();
    const finalIds = final
      .filter((i) => i.public_id) // 👈 SOLO existentes
      .map((i) => i.public_id)
      .sort();

    // borradas o reordenadas
    if (JSON.stringify(initialIds) !== JSON.stringify(finalIds)) {
      return true;
    }

    // nuevas o editadas
    const hasNewFiles = final.some((i) => i.file instanceof File);
    return hasNewFiles;
  };

  const getFinalImages = () => {
    return uploaderRef.current?.getImages() ?? [];
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateFormBeforeSubmit()) return;

    const finalImages = getFinalImages();

    //console.log("INITIAL IMAGES", initialImagesRef.current);
    //console.log("FINAL IMAGES", finalImages);

    //return;

    const imagesChanged = imagesHaveChanged(
      initialImagesRef.current,
      finalImages
    );

    if (!textDirty && !imagesChanged) {
      addToast({
        title: "El producto no ha cambiado",
        description: "No se han guardado cambios",
        color: "warning",
      });
      return;
    }

    let payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      longDescription: formData.longDescription,
      price: Number(formData.price),
      status: formData.status,
      oferta: !!formData.oferta,
      destacado: !!formData.destacado,
      stock: Number(formData.stock),
      categories: formData.categories,
      active: !!formData.active,
    };
    console.log("FORMDATA", payload);

    if (productId) {
      // EDITAR PRODUCTO
      try {
        setSubmitting(true);
        if (textDirty) {
          const productData = await updateProductById(productId, payload);
          //console.log("Producto actualizado:", productData);
          updateProduct(productId, productData.product);
        }

        if (imagesChanged) {
          await uploadImages(productId, finalImages);
        }
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
      return;
    } else {
      // CREAR PRODUCTO
      try {
        setSubmitting(true);
        const productData = await createProduct(payload);
        setStoreProductsList((prev) => [...prev, productData.savedProduct]);
        addToast({
          title: "Éxito",
          description: "Producto creado correctamente. Guardando imágenes...",
          color: "success",
        });
        const finalImages = getFinalImages();
        await uploadImages(productData.productId, finalImages);
      } catch (err) {
        console.error(err);
        addToast({
          title: "Error",
          description: err?.message || "Error al guardar producto",
          color: "danger",
        });
      } finally {
        setSubmitting(false);
        navigate("/store-admin/productos/todos");
      }
    }
  };

  const uploadImages = async (productId, finalImages = []) => {
    try {
      if (!productId) throw new Error("ID de producto no válido");

      const initialIds = initialImagesRef.current.map((i) => i.public_id);
      const finalIds = finalImages.map((i) => i.public_id).filter(Boolean);

      const deleted = initialIds.filter((id) => !finalIds.includes(id));
      const added = finalImages.filter((i) => i.file instanceof File);

      for (const id of deleted) {
        await deleteProductImage(productId, id);
      }

      for (const img of added) {
        await uploadProductImage(img.file, productId);
      }

      // volver a pedir el producto actualizado
      const updated = await updateProductById(productId, {});

      // actualizar store
      updateProduct(productId, updated.product);

      // sincronizar referencia inicial
      initialImagesRef.current = updated.product.images.map((img) => ({
        public_id: img.public_id,
        source: img.url,
      }));

      // resetear estado dirty
      setTextDirty(false);
      // resetear FileUploader
      uploaderRef.current?.reset();

      addToast({
        title: "Éxito",
        description: "Imágenes actualizadas correctamente",
        color: "success",
      });

      navigate("/store-admin/productos/todos");
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
    <div className="relative z-0">
      {/* overlay con spinner */}
      {submitting && (
        <div className="absolute z-50 top-[-1rem] left-[-1rem] left-0 w-[calc(100%+2rem)] h-[calc(100%+2rem)] flex items-center justify-center bg-white/10 filter backdrop-blur-xs">
          <Spinner
            classNames={{ label: "text-foreground mt-3 text-sm" }}
            label="actualizando tienda..."
            labelColor="primary"
            variant="gradient"
            color="primary"
            size="lg"
          />
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">
        {productId && resolvedProduct
          ? `Editar Producto: ${resolvedProduct.title}`
          : "Añadir Nuevo Producto"}
      </h3>
      <p className="text-gray-700">
        {productId
          ? "Modifica el siguiente formulario para editar el producto"
          : "Rellena el siguiente formulario para añadir un nuevo producto"}
      </p>
      <form onSubmit={handleSubmit} className="product-form pt-3 ">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 mb-4">
          <div className="flex flex-col gap-4 mt-4 mb-4">
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
              selectionMode="multiple"
              className="mt-2"
              selectedKeys={new Set(formData.categories)}
              onSelectionChange={(keys) => {
                setField("categories", Array.from(keys));
              }}
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
              className="mt-2"
              selectedKeys={new Set([formData.status])}
              onSelectionChange={(keys) => {
                const [value] = Array.from(keys);
                setField("status", value);
              }}
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

          <div className="flex flex-col gap-4 mt-0 lg:mt-4">
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
            <FileUploader
              images={productImages}
              imageSizePreset="square"
              ref={uploaderRef}
            />
          </div>
        </div>

        <div className="actions w-full flex justify-center gap-3">
          {productId && (
            <Button
              className="bg-danger-200 w-[180px]"
              type="button"
              onPress={() => navigate(`/store-admin/productos/todos`)}
              disabled={submitting}
              startContent={<Ban size={14} />}
            >
              Cancelar
            </Button>
          )}
          <Button
            className="bg-primary w-[180px]"
            type="submit"
            disabled={submitting}
            startContent={<Save size={14} />}
          >
            {submitting ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
