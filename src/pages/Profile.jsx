import { useState, useEffect, useRef, useContext } from "react";
import { Card, CardBody, CardHeader, Button, Input, Divider, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, addToast } from "@heroui/react";
import { MapPin, Edit, Trash2, Plus, ChevronDown, Check, Camera, Upload } from "lucide-react";
import { getUser, getUserAddresses, updateAddress, deleteAddress, createAddress, setDefaultAddress, uploadProfileImage, updateUserProfile } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({});
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const fileInputRef = useRef(null);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [expandedAddresses, setExpandedAddresses] = useState({});

  // Modal para crear/editar dirección
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "España",
    phoneNumber: "",
    isDefault: false,
  });

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Si ya hay usuario en el contexto, usarlo
        if (user) {
          setUserForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage || "https://i.pravatar.cc/200",
          });
        } else {
          // Si no hay usuario en el contexto, obtenerlo del servidor
          const userData = await getUser();
          setUserForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            profileImage: userData.profileImage || "https://i.pravatar.cc/200",
          });
        }
        loadAddresses();
      } catch (error) {
        addToast({
          title: "Error",
          description: "Error cargando perfil",
          color: "danger",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user]);

  // Cargar direcciones
  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await getUserAddresses();
      setAddresses(data);
      setExpandedAddresses({}); // Resetear expanded addresses cuando cargamos
    } catch (error) {
      addToast({
        title: "Error",
        description: "Error cargando direcciones",
        color: "danger",
        duration: 4000,
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Manejar cambios en el formulario de usuario
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  // Manejar carga de imagen de perfil
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Error",
        description: "Por favor selecciona una imagen válida",
        color: "danger",
        duration: 4000,
      });
      return;
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: "Error",
        description: "La imagen no debe superar 5MB",
        color: "danger",
        duration: 4000,
      });
      return;
    }

    setUploadingProfileImage(true);
    try {
      const result = await uploadProfileImage(file);
      updateUser({ profileImage: result.url });
      setUserForm({ ...userForm, profileImage: result.url });
      addToast({
        title: "Éxito",
        description: "Imagen de perfil actualizada",
        color: "success",
        duration: 4000,
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Error al subir la imagen",
        color: "danger",
        duration: 4000,
      });
    } finally {
      setUploadingProfileImage(false);
      // Reset del input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Guardar cambios del usuario
  const saveUserChanges = async () => {
    try {
      // Llamar al endpoint para actualizar el perfil en el backend
      const result = await updateUserProfile(userForm.firstName, userForm.lastName);

      // Actualizar en el contexto (esto también actualiza localStorage)
      updateUser({
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      });

      setEditingUser(false);
      addToast({
        title: "Éxito",
        description: "Perfil actualizado",
        color: "success",
        duration: 4000,
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: error.response?.data?.msg || "Error actualizando perfil",
        color: "danger",
        duration: 4000,
      });
    }
  };

  // Manejar cambios en el formulario de dirección
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Abrir modal para nueva dirección
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      title: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "España",
      phoneNumber: "",
      isDefault: false,
    });
    onOpen();
  };

  // Abrir modal para editar dirección
  const openEditAddressModal = (address) => {
    setEditingAddressId(address._id);
    setAddressForm(address);
    onOpen();
  };

  // Guardar dirección (crear o editar)
  const saveAddress = async () => {
    try {
      if (!addressForm.title || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode || !addressForm.phoneNumber) {
        addToast({
          title: "Advertencia",
          description: "Completa todos los campos",
          color: "warning",
          duration: 4000,
        });
        return;
      }

      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        addToast({
          title: "Éxito",
          description: "Dirección actualizada",
          color: "success",
          duration: 4000,
        });
      } else {
        await createAddress(addressForm);
        addToast({
          title: "Éxito",
          description: "Dirección creada",
          color: "success",
          duration: 4000,
        });
      }
      loadAddresses();
      onOpenChange(false);
    } catch (error) {
      addToast({
        title: "Error",
        description: error.response?.data?.msg || "Error guardando dirección",
        color: "danger",
        duration: 4000,
      });
    }
  };

  // Eliminar dirección
  const deleteAddressHandler = async (id) => {
    try {
      if (confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
        await deleteAddress(id);
        addToast({
          title: "Éxito",
          description: "Dirección eliminada",
          color: "success",
          duration: 4000,
        });
        loadAddresses();
      }
    } catch (error) {
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
      addToast({
        title: "Éxito",
        description: "Dirección establecida como predeterminada",
        color: "success",
        duration: 4000,
      });
      loadAddresses();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Error estableciendo dirección predeterminada",
        color: "danger",
        duration: 4000,
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center bg-gray-50 min-h-screen py-10">
        <Spinner color="current" size="lg" />
      </div>
    );
  }

  const defaultAddress = addresses.find((a) => a.isDefault);

  return (
    <div className="w-full  py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* PERFIL DEL USUARIO */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {/* Imagen de perfil con overlay para cambiar */}
                <div className="relative group">
                  <img
                    src={userForm.profileImage}
                    alt="avatar"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingProfileImage}
                    className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    {uploadingProfileImage ? (
                      <Spinner size="sm" color="current" />
                    ) : (
                      <Camera size={24} className="text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                    disabled={uploadingProfileImage}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Mi Perfil</h1>
                  <p className="text-teal-100">{userForm.email}</p>
                </div>
              </div>
              {!editingUser && (
                <Button
                  isIconOnly
                  variant="light"
                  className="text-white"
                  onPress={() => setEditingUser(true)}
                >
                  <Edit size={20} />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardBody className="p-6">
            {!editingUser ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nombre</label>
                  <p className="text-lg text-gray-900">{userForm.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Apellido</label>
                  <p className="text-lg text-gray-900">{userForm.lastName}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-lg text-gray-900">{userForm.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleUserChange}
                    variant="bordered"
                  />
                  <Input
                    label="Apellido"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleUserChange}
                    variant="bordered"
                  />
                </div>
                <Input
                  label="Email"
                  name="email"
                  value={userForm.email}
                  disabled
                  variant="bordered"
                  className="text-gray-500"
                />
                <div className="flex gap-3 pt-4">
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={() => setEditingUser(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="success"
                    onPress={saveUserChanges}
                    className="text-white"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* SECCIÓN DE DIRECCIONES */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-lg">
                <MapPin size={24} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Direcciones</h2>
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
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card
                  key={address._id}
                  className={`shadow-sm hover:shadow-md transition-shadow ${address.isDefault ? "border-2 border-teal-600" : ""
                    }`}
                >
                  <CardHeader className="flex justify-between items-start p-4">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{address.title}</h3>
                      {address.isDefault && (
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                          <Check size={14} /> Por defecto
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setExpandedAddresses({
                          ...expandedAddresses,
                          [address._id]: !expandedAddresses[address._id],
                        })
                      }
                      className="text-gray-600 hover:text-gray-900 ml-2 flex-shrink-0"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${expandedAddresses[address._id] ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  </CardHeader>

                  {expandedAddresses[address._id] && (
                    <>
                      <Divider />
                      <CardBody className="space-y-3 text-sm p-4">
                        <div>
                          <p className="font-semibold text-gray-700">Dirección</p>
                          <p className="text-gray-600 break-words">{address.street}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="font-semibold text-gray-700">Ciudad</p>
                            <p className="text-gray-600">{address.city}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Provincia</p>
                            <p className="text-gray-600">{address.state}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="font-semibold text-gray-700">Código Postal</p>
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editingAddressId ? "Editar Dirección" : "Agregar Nueva Dirección"}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      label="Nombre de la dirección"
                      name="title"
                      placeholder="Ej: Casa, Oficina, Casa de campo"
                      value={addressForm.title}
                      onChange={handleAddressChange}
                      variant="bordered"
                    />
                    <Input
                      label="Calle y número"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      variant="bordered"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Ciudad"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        variant="bordered"
                      />
                      <Input
                        label="Provincia"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        variant="bordered"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Código Postal"
                        name="postalCode"
                        value={addressForm.postalCode}
                        onChange={handleAddressChange}
                        variant="bordered"
                      />
                      <Input
                        label="País"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        variant="bordered"
                      />
                    </div>
                    <Input
                      label="Teléfono"
                      name="phoneNumber"
                      type="tel"
                      value={addressForm.phoneNumber}
                      onChange={handleAddressChange}
                      variant="bordered"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Usar como dirección predeterminada
                      </span>
                    </label>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="primary" onPress={saveAddress} className="text-white">
                    {editingAddressId ? "Guardar Cambios" : "Crear Dirección"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
