import { useState } from "react";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    nombre: "Juan Pérez",
    email: "juanperez@gmail.com",
    telefono: "555-123-456",
    direccion: {
      calle: "Av. Las Flores 123",
      ciudad: "Ciudad de México",
      pais: "México",
      cp: "01234",
    },
    avatar: "https://i.pravatar.cc/200",
    preferencias: {
      newsletter: true,
      notificaciones: false,
    },
  });

  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Manejo especial para campos anidados (direccion)
    if (name.startsWith("direccion.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        direccion: { ...form.direccion, [field]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const saveChanges = () => {
    setUser(form);
    setEditMode(false);
  };

  const cancelEdit = () => {
    setForm(user);
    setEditMode(false);
  };

  return (
    <div className="w-full flex justify-center bg-gray-100 py-10">
      <div className="max-w-4xl bg-white p-10 rounded-xl shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-teal-600">Mi Perfil</h1>

        {/* ENCABEZADO */}
        <div className="flex items-center gap-6">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full border shadow"
          />

          {!editMode ? (
            <div>
              <h2 className="text-2xl font-semibold">{user.nombre}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.telefono}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
            </div>
          )}
        </div>

        <hr className="my-8" />

        {/* INFORMACION PERSONAL */}
        <section>
          <h3 className="text-xl font-semibold text-teal-700">
            Información Personal
          </h3>

          {!editMode ? (
            <div className="mt-3 space-y-2">
              <p>
                <strong>Nombre:</strong> {user.nombre}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {user.telefono}
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}
        </section>

        <hr className="my-8" />

        {/* DIRECCION */}
        <section>
          <h3 className="text-xl font-semibold text-teal-700">Dirección</h3>

          {!editMode ? (
            <div className="mt-3 space-y-2">
              <p>
                <strong>Calle:</strong> {user.direccion.calle}
              </p>
              <p>
                <strong>Ciudad:</strong> {user.direccion.ciudad}
              </p>
              <p>
                <strong>País:</strong> {user.direccion.pais}
              </p>
              <p>
                <strong>Código Postal:</strong> {user.direccion.cp}
              </p>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="direccion.calle"
                value={form.direccion.calle}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="Calle"
              />
              <input
                type="text"
                name="direccion.ciudad"
                value={form.direccion.ciudad}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="Ciudad"
              />
              <input
                type="text"
                name="direccion.pais"
                value={form.direccion.pais}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="País"
              />
              <input
                type="text"
                name="direccion.cp"
                value={form.direccion.cp}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                placeholder="Código Postal"
              />
            </div>
          )}
        </section>

        {/* BOTONES */}
        <div className="mt-10 flex justify-end gap-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow"
            >
              Editar Perfil
            </button>
          ) : (
            <>
              <button
                onClick={cancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg shadow"
              >
                Cancelar
              </button>

              <button
                onClick={saveChanges}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow"
              >
                Guardar Cambios
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
