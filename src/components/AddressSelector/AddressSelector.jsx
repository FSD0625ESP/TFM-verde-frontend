import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Spinner,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { MapPin, Edit, Trash2, Plus, ChevronDown, Check } from "lucide-react";
import {
  getUserAddresses,
  setDefaultAddress,
  deleteAddress,
} from "../../services/api";
import AddressCreateModal from "./AddressCreateModal";

export default function AddressSelector({
  mode = "view", // "view" para perfil, "checkout" para seleccionar
  selectedAddressId = null,
  onAddressSelect = null, // Callback cuando se selecciona una dirección en checkout
}) {
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [expandedAddressId, setExpandedAddressId] = useState(null); // Solo un ID expandido
  const [selected, setSelected] = useState(selectedAddressId);

  // Modal para crear/editar dirección
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  // Cargar direcciones
  const loadAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      const data = await getUserAddresses();
      setAddresses(data);
      setExpandedAddressId(null); // Resetear expanded address cuando cargamos

      // Si no hay dirección seleccionada en checkout, seleccionar la default
      if (mode === "checkout" && !selected) {
        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelected(defaultAddr._id);
          onAddressSelect?.(defaultAddr._id);
        }
      }
    } catch {
      addToast({
        title: "Error",
        description: "Error cargando direcciones",
        color: "danger",
        duration: 4000,
      });
    } finally {
      setLoadingAddresses(false);
    }
  }, [mode, selected, onAddressSelect]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Abrir modal para nueva dirección
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setEditingAddress(null);
    onOpen();
  };

  // Abrir modal para editar dirección
  const openEditAddressModal = (address) => {
    setEditingAddressId(address._id);
    setEditingAddress(address);
    onOpen();
  };

  // Eliminar dirección
  const deleteAddressHandler = async (id) => {
    try {
      if (confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
        await deleteAddress(id);
        loadAddresses();
        addToast({
          title: "Éxito",
          description: "Dirección eliminada",
          color: "success",
          duration: 4000,
        });
      }
    } catch {
      addToast({
        title: "Error",
        description: "Error eliminando dirección",
        color: "danger",
        duration: 4000,
      });
    }
  };

  // Establecer como dirección predeterminada
  const setAsDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      loadAddresses();
      addToast({
        title: "Éxito",
        description: "Dirección establecida como predeterminada",
        color: "success",
        duration: 4000,
      });
    } catch {
      addToast({
        title: "Error",
        description: "Error estableciendo dirección predeterminada",
        color: "danger",
        duration: 4000,
      });
    }
  };

  // Manejar selección en modo checkout
  const handleSelectAddress = (addressId) => {
    setSelected(addressId);
    onAddressSelect?.(addressId);
  };

  return (
    <div>
      {/* SECCIÓN DE DIRECCIONES */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <MapPin size={24} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {mode === "checkout"
                  ? "Selecciona una dirección"
                  : "Mis Direcciones"}
              </h2>
              <p className="text-sm text-gray-600">
                {addresses.length} dirección{addresses.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Plus size={20} />}
            onPress={openNewAddressModal}
            className="text-white w-full sm:w-auto"
          >
            Agregar Dirección
          </Button>
        </div>

        {loadingAddresses ? (
          <div className="flex justify-center py-10">
            <Spinner color="current" size="lg" />
          </div>
        ) : addresses.length === 0 ? (
          <Card className="shadow-sm">
            <CardBody className="text-center py-10">
              <p className="text-gray-600">No tienes direcciones registradas</p>
              {mode === "view" && (
                <Button
                  color="primary"
                  startContent={<Plus size={20} />}
                  onPress={openNewAddressModal}
                  className="text-white mt-4 mx-auto"
                >
                  Agregar Dirección
                </Button>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 auto-rows-auto">
            {addresses.map((address) => (
              <Card
                key={address._id}
                className={`shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  address.isDefault && mode === "view"
                    ? "border-2 border-teal-600"
                    : ""
                } ${
                  mode === "checkout" && selected === address._id
                    ? "border-2 border-teal-600 bg-teal-50"
                    : ""
                }`}
                onClick={() =>
                  mode === "checkout" && handleSelectAddress(address._id)
                }
              >
                <CardHeader className="flex justify-between items-start p-4">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {mode === "checkout" && (
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selected === address._id}
                        onChange={() => handleSelectAddress(address._id)}
                        className="w-4 h-4 text-teal-600 rounded mt-0.5 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex gap-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                        {address.title}
                      </h3>
                      {address.isDefault && mode === "view" && (
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap mt-1 w-fit">
                          <Check size={14} /> Por defecto
                        </span>
                      )}
                      {address.isDefault && mode === "checkout" && (
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap mt-1 w-fit">
                          <Check size={14} /> Predeterminada
                        </span>
                      )}
                    </div>
                  </div>
                  {mode === "view" && (
                    <button
                      onClick={() =>
                        setExpandedAddressId(
                          expandedAddressId === address._id ? null : address._id
                        )
                      }
                      className="text-gray-600 hover:text-gray-900 ml-2 shrink-0"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          expandedAddressId === address._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                  {mode === "checkout" && (
                    <button
                      onClick={() =>
                        setExpandedAddressId(
                          expandedAddressId === address._id ? null : address._id
                        )
                      }
                      className="text-gray-600 hover:text-gray-900 ml-2 shrink-0"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          expandedAddressId === address._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </CardHeader>

                {expandedAddressId === address._id && (
                  <>
                    <Divider />
                    <CardBody className="space-y-3 text-sm p-4">
                      <div>
                        <p className="font-semibold text-gray-700">Dirección</p>
                        <p className="text-gray-600 wrap-break-word">
                          {address.street}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="font-semibold text-gray-700">Ciudad</p>
                          <p className="text-gray-600">{address.city}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">
                            Provincia
                          </p>
                          <p className="text-gray-600">{address.state}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="font-semibold text-gray-700">
                            Código Postal
                          </p>
                          <p className="text-gray-600">{address.postalCode}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">País</p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Teléfono</p>
                        <p className="text-gray-600">{address.phoneNumber}</p>
                      </div>

                      <Divider className="my-2" />

                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          size="sm"
                          startContent={<Edit size={16} />}
                          onPress={() => openEditAddressModal(address)}
                          className="text-white bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          startContent={<Trash2 size={16} />}
                          color="danger"
                          variant="bordered"
                          onPress={() => deleteAddressHandler(address._id)}
                          className="w-full sm:w-auto"
                        >
                          Eliminar
                        </Button>
                        {!address.isDefault && (
                          <Button
                            size="sm"
                            variant="bordered"
                            onPress={() => setAsDefault(address._id)}
                            className="w-full sm:w-auto"
                          >
                            Usar como predeterminada
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PARA CREAR/EDITAR DIRECCIÓN */}
      <AddressCreateModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        editingAddressId={editingAddressId}
        initialAddress={editingAddress}
        onAddressSaved={() => {
          setEditingAddressId(null);
          setEditingAddress(null);
          loadAddresses();
        }}
      />
    </div>
  );
}
