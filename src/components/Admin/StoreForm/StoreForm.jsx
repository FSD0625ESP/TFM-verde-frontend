import { useEffect, useState, useMemo, useRef } from "react";
import { useContext } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { CircleCheck, CircleX, Ban, Link as LinkIcon, Eye as EyeIcon } from "lucide-react";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Checkbox,
  Switch,
  Spinner,
  addToast,
} from "@heroui/react";
import { StoreContext } from "../../../contexts/StoreContext";
//import { getAllCategories } from "../../../services/api";
import slugify from "slugify";
import { updateStoreById } from "../../../services/api";
import { Link } from "react-router-dom";

export default function StoreForm() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const { storeData, storeCategories, allCategories } =
    useContext(StoreContext);
  const [selectedCategories, setSelectedCategories] = useState([]);

  //categoriesList = storeCategories;

  const [formData, setFormData] = useState({
    active: true,
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    categories: [], // array of ids (strings)
    socialLinks: {
      instagram: "",
      facebook: "",
      web: "",
    },
    billingInfo: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const setField = (k, v) => {
    setFormData((s) => ({ ...s, [k]: v }));
  };

  const setSocialLink = (key, value) => {
    setFormData((s) => ({
      ...s,
      socialLinks: {
        ...s.socialLinks,
        [key]: value,
      },
    }));
  };

  const setBillingField = (key, value) => {
    setFormData((s) => ({
      ...s,
      billingInfo: {
        ...s.billingInfo,
        [key]: value,
      },
    }));
  };

  // cargar los datos actuales de la tienda en el formulario
  useEffect(() => {
    if (storeData.name && formData.name === "") {
      console.log("storeData in useEffect", storeData);
      setFormData({
        active: storeData.active ?? true,
        name: storeData.name ?? "",
        slug: storeData.slug ?? "",
        description: storeData.description ?? "",
        longDescription: storeData.longDescription ?? "",
        categories: Array.isArray(storeData.categories)
          ? storeData.categories.map((c) => (typeof c === "string" ? c : c._id))
          : [],
        socialLinks: {
          instagram: storeData.socialLinks?.instagram || "",
          facebook: storeData.socialLinks?.facebook || "",
          web: storeData.socialLinks?.web || "",
        },
        billingInfo: {
          name: storeData.billingInfo?.name || "",
          address: storeData.billingInfo?.address || "",
          phone: storeData.billingInfo?.phone || "",
          email: storeData.billingInfo?.email || "",
        },
      });
    }
  }, [storeData]);

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
  const validateShopName = (v) => {
    if (!v || v.trim().length < 1) return "El nombre de la tienda es requerido";
    return true;
  };
  const validateDescription = (v) => {
    if (!v || v.trim().length < 1)
      return "La descripción de la tienda es requerida";
    return true;
  };
  const validateLongDescription = (v) => {
    if (!v || v.trim().length < 1)
      return "La descripción larga de la tienda es requerida";
    return true;
  };
  const validateCategories = (v) => {
    if (!v || v.length === 0) return "Selecciona al menos una categoría";
    return true;
  };
  const validateInstagram = (v) => {
    if (!v.startsWith("https://")) {
      return "El enlace de Instagram debe comenzar con https://";
    }
    if (v.trim().length > 1) {
      if (!v.startsWith("https://www.instagram.com/")) {
        return "El enlace de Instagram no es válido";
      }
    }
    return true;
  };
  const validateFacebook = (v) => {
    if (v.trim().length > 1) {
      if (!v.startsWith("https://")) {
        return "El enlace de Facebook debe comenzar con https://";
      }
      if (!v.startsWith("https://www.facebook.com/")) {
        return "El enlace de Facebook no es válido";
      }
    }
    return true;
  };
  const validateWeb = (v) => {
    if (v.trim().length > 1) {
      if (!v.startsWith("http://") && !v.startsWith("https://")) {
        return "El enlace del sitio web debe comenzar con http:// o https://";
      }
    }
    return true;
  };
  const validateBillingName = (v) => {
    if (!v || v.trim().length < 1)
      return "El nombre del propietario de la tienda es requerido";
    return true;
  };
  const validateBillingAddress = (v) => {
    if (!v || v.trim().length < 1)
      return "La dirección de facturación es requerida";
    return true;
  };
  const validateBillingPhone = (v) => {
    if (!v || v.trim().length < 1)
      return "El teléfono de facturación es requerido";
    return true;
  };
  const validateBillingEmail = (v) => {
    if (!v || v.trim().length < 1)
      return "El correo electrónico de facturación es requerido";
    return true;
  };

  const handleShopNameChange = (v) => {
    // v is value from Input onChange (heroui passes event for Input, but we keep event style)
    // Accept either event or string
    const value = typeof v === "string" ? v : v.target?.value;
    setField("name", value);
    // auto-generate slug only if slug is empty or matches previous generated
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      setField("slug", generateSlug(value));
    }
  };

  const validateFormBeforeSubmit = () => {
    // run the small validation set, show toasts for issues
    const nameOk = validateShopName(formData.name) === true;
    const descOk = validateDescription(formData.description) === true;
    const longDescOk =
      validateLongDescription(formData.longDescription) === true;
    const categoriesOk = validateCategories(formData.categories) === true;
    const instagramOk =
      validateInstagram(formData.socialLinks.instagram) === true;
    const facebookOk = validateFacebook(formData.socialLinks.facebook) === true;
    const webOk = validateWeb(formData.socialLinks.web) === true;
    const billingNameOk =
      validateBillingName(formData.billingInfo.name) === true;
    const billingAddressOk =
      validateBillingAddress(formData.billingInfo.address) === true;
    const billingPhoneOk =
      validateBillingPhone(formData.billingInfo.phone) === true;
    const billingEmailOk =
      validateBillingEmail(formData.billingInfo.email) === true;

    if (!nameOk) {
      addToast({
        title: "Validación campo nombre",
        description: validateShopName(formData.name),
        color: "danger",
      });
      return false;
    }
    if (!descOk) {
      addToast({
        title: "Validación campo descripción",
        description: validateDescription(formData.description),
        color: "danger",
      });
      return false;
    }
    if (!longDescOk) {
      addToast({
        title: "Validación campo descripción larga",
        description: validateLongDescription(formData.longDescription),
        color: "danger",
      });
      return false;
    }
    if (!categoriesOk) {
      addToast({
        title: "Validación campo categorías",
        description: validateCategories(formData.categories),
        color: "danger",
      });
      return false;
    }
    if (!instagramOk) {
      addToast({
        title: "Validación campo Instagram",
        description: validateInstagram(formData.socialLinks.instagram),
        color: "danger",
      });
      return false;
    }
    if (!facebookOk) {
      addToast({
        title: "Validación campo Facebook",
        description: validateFacebook(formData.socialLinks.facebook),
        color: "danger",
      });
      return false;
    }
    if (!webOk) {
      addToast({
        title: "Validación campo web",
        description: validateWeb(formData.socialLinks.web),
        color: "danger",
      });
      return false;
    }
    if (!billingNameOk) {
      addToast({
        title: "Validación campo nombre de facturación",
        description: validateBillingName(formData.billingInfo.name),
        color: "danger",
      });
      return false;
    }
    if (!billingAddressOk) {
      addToast({
        title: "Validación campo dirección de facturación",
        description: validateBillingAddress(formData.billingInfo.address),
        color: "danger",
      });
      return false;
    }
    if (!billingPhoneOk) {
      addToast({
        title: "Validación campo teléfono de facturación",
        description: validateBillingPhone(formData.billingInfo.phone),
        color: "danger",
      });
      return false;
    }
    if (!billingEmailOk) {
      addToast({
        title: "Validación campo email de facturación",
        description: validateBillingEmail(formData.billingInfo.email),
        color: "danger",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateFormBeforeSubmit();

    if (!validateFormBeforeSubmit()) return;

    setSubmitting(true);

    let payload = {
      active: !!formData.active,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      longDescription: formData.longDescription,
      categories: formData.categories,
      socialLinks: {
        instagram: formData.socialLinks.instagram || null,
        facebook: formData.socialLinks.facebook || null,
        web: formData.socialLinks.web || null,
      },
      billingInfo: {
        name: formData.billingInfo.name || null,
        address: formData.billingInfo.address || null,
        phone: formData.billingInfo.phone || null,
        email: formData.billingInfo.email || null,
      },
    };
    //console.log("FORMDATA", payload);

    try {
      const updatedData = await updateStoreById(
        storeData._id,
        user._id,
        payload
      );
      addToast({
        title: "Éxito",
        description: "Tienda modificada con éxito",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: err?.message || "Error al modificar la tienda",
        color: "danger",
      });
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 500);
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
        Edita la información de la tienda
      </h3>
      <p className="text-gray-700">
        Modifica el siguiente formulario para actualizar los datos de tu tienda.
      </p>
      <form onSubmit={handleSubmit} className="product-form pt-3 ">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 mb-4">
          <div className="flex flex-col gap-4 mt-4 mb-4">
            <div className="flex gap-2 justify-between">
            <Switch
              isSelected={!!formData.active}
              color="success"
              onChange={(e) => setField("active", e.target.checked)}
              thumbIcon={({ isSelected }) =>
                isSelected ? (
                  <CircleCheck className="fill-success stroke-white" />
                ) : (
                  <CircleX className="fill-danger stroke-white" />
                )
              }
            >
              {formData.active ? (
                "Tienda activa"
              ) : (
                <span className="text-danger font-semibold">
                  Tienda desactivada
                </span>
              )}
            </Switch>
            <Button  color="warning" onClick={() => navigate(`/store/${formData.slug}/${storeData._id}`)}>
              <EyeIcon className="mr-2" />Preview Store
            </Button>
            </div>
            <Input
              type="text"
              name="name"
              label="Nombre de la tienda"
              value={formData.name}
              onChange={handleShopNameChange}
              validate={validateShopName}
              isRequired
              {...inputStyleProps}
            />
            <Textarea
              name="description"
              label="Descripción de la tienda"
              value={formData.description}
              onChange={(e) => setField("description", e.target.value)}
              validate={validateDescription}
              isRequired
              {...inputStyleProps}
            />
            <Textarea
              name="longDescription"
              label="Descripción detallada de la tienda"
              onChange={(e) => setField("longDescription", e.target.value)}
              value={formData.longDescription}
              validate={validateLongDescription}
              {...inputStyleProps}
            />
            <Select
              label="Categoría/s de la tienda"
              placeholder="Seleccionar categoría/s"
              selectionMode="multiple"
              selectedKeys={new Set(formData.categories)}
              onSelectionChange={(keys) => {
                setField("categories", Array.from(keys));
              }}
              validate={validateCategories}
              isRequired
            >
              {/*{categoriesList.map((c) => ( */}
              {allCategories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </Select>
            <div className="block font-medium">Redes sociales</div>
            <Input
              type="text"
              name="instagram"
              label="Instagram"
              value={formData.socialLinks.instagram}
              onChange={(e) => setSocialLink("instagram", e.target.value)}
              validate={validateInstagram}
              {...inputStyleProps}
            />
            <Input
              type="text"
              name="facebook"
              label="Facebook"
              value={formData.socialLinks.facebook}
              onChange={(e) => setSocialLink("facebook", e.target.value)}
              validate={validateFacebook}
              {...inputStyleProps}
            />
            <Input
              type="text"
              name="web"
              label="Sitio web"
              value={formData.socialLinks.web}
              onChange={(e) => setSocialLink("web", e.target.value)}
              validate={validateWeb}
              {...inputStyleProps}
            />
          </div>

          <div className="flex flex-col gap-4 mt-0 lg:mt-5">
            <div className="block font-medium">Datos de facturación</div>
            <Input
              type="text"
              name="name"
              label="Nombre del propietario de la tienda"
              value={formData.billingInfo.name}
              onChange={(e) => setBillingField("name", e.target.value)}
              validate={validateBillingName}
              isRequired
              {...inputStyleProps}
            />

            <Input
              type="text"
              name="address"
              label="Dirección de la tienda"
              value={formData.billingInfo.address}
              onChange={(e) => setBillingField("address", e.target.value)}
              validate={validateBillingAddress}
              isRequired
              {...inputStyleProps}
            />
            <Input
              type="email"
              name="email"
              label="Correo electrónico de la tienda"
              value={formData.billingInfo.email}
              onChange={(e) => setBillingField("email", e.target.value)}
              validate={validateBillingEmail}
              isRequired
              {...inputStyleProps}
            />
            <Input
              type="text"
              name="phone"
              label="Teléfono de la tienda"
              value={formData.billingInfo.phone}
              onChange={(e) => setBillingField("phone", e.target.value)}
              validate={validateBillingPhone}
              isRequired
              {...inputStyleProps}
            />
          </div>
        </div>

        <div className="actions w-full flex justify-center gap-3">
          <Button type="submit">
            {submitting ? "Guardando..." : "Modificar tienda"}
          </Button>
        </div>
      </form>
    </div>
  );
}
