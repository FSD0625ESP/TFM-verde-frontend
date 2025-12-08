import { useState, useEffect, useRef, useContext } from "react";
import { Card, CardBody, CardHeader, Button, Input, Spinner, addToast } from "@heroui/react";
import { Edit, Camera } from "lucide-react";
import { getUser, uploadProfileImage, updateUserProfile } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import AddressSelector from "../components/AddressSelector/AddressSelector";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({});
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const fileInputRef = useRef(null);

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
      } catch {
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

  if (loading) {
    return (
      <div className="w-full flex justify-center bg-gray-50 min-h-screen py-10">
        <Spinner color="current" size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full  py-10">
      <div className="container mx-auto px-4">
        {/* PERFIL DEL USUARIO */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="bg-linear-to-r from-teal-600 to-teal-700 text-white p-6">
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
        <AddressSelector mode="view" />
        {/* EJEMPLO DE PÁGINA DE CHECKOUT */}
      </div>
    </div>
  );
}
