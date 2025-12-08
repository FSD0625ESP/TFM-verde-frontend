import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, addToast } from "@heroui/react";
import { updateAddress, createAddress } from "../../services/api";

export default function AddressCreateModal({
    isOpen,
    onOpenChange,
    editingAddressId = null,
    initialAddress = null,
    onAddressSaved = null
}) {
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

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Actualizar el formulario cuando se abre para editar
    useEffect(() => {
        if (editingAddressId && initialAddress) {
            setAddressForm(initialAddress);
            setErrors({});
        } else {
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
            setErrors({});
        }
    }, [editingAddressId, initialAddress, isOpen]);

    // Validar campos
    const validateForm = () => {
        const newErrors = {};

        if (!addressForm.title || addressForm.title.trim() === "") {
            newErrors.title = "El nombre de la dirección es requerido";
        }

        if (!addressForm.street || addressForm.street.trim() === "") {
            newErrors.street = "La calle y número son requeridos";
        }

        if (!addressForm.city || addressForm.city.trim() === "") {
            newErrors.city = "La ciudad es requerida";
        }

        if (!addressForm.state || addressForm.state.trim() === "") {
            newErrors.state = "La provincia es requerida";
        }

        if (!addressForm.postalCode || addressForm.postalCode.trim() === "") {
            newErrors.postalCode = "El código postal es requerido";
        } else if (!/^\d{5}$/.test(addressForm.postalCode.trim())) {
            newErrors.postalCode = "El código postal debe tener 5 dígitos";
        }

        if (!addressForm.phoneNumber || addressForm.phoneNumber.trim() === "") {
            newErrors.phoneNumber = "El teléfono es requerido";
        } else if (!/^[0-9+\s\-()]{9,}$/.test(addressForm.phoneNumber.trim())) {
            newErrors.phoneNumber = "El teléfono debe tener al menos 9 dígitos";
        }

        if (!addressForm.country || addressForm.country.trim() === "") {
            newErrors.country = "El país es requerido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en el formulario
    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressForm({
            ...addressForm,
            [name]: type === "checkbox" ? checked : value,
        });
        // Limpiar el error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    // Guardar dirección
    const saveAddress = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            if (editingAddressId) {
                await updateAddress(editingAddressId, addressForm);
                addToast({
                    title: "Éxito",
                    description: "Dirección actualizada correctamente",
                    color: "success",
                    duration: 4000,
                });
            } else {
                await createAddress(addressForm);
                addToast({
                    title: "Éxito",
                    description: "Dirección creada correctamente",
                    color: "success",
                    duration: 4000,
                });
            }
            onAddressSaved?.();
            onOpenChange(false);
        } catch (error) {
            addToast({
                title: "Error",
                description: error.response?.data?.msg || "Error al guardar la dirección",
                color: "danger",
                duration: 4000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
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
                                    errorMessage={errors.title}
                                    isInvalid={!!errors.title}
                                    isClearable
                                />
                                <Input
                                    label="Calle y número"
                                    name="street"
                                    placeholder="Ej: Calle Principal 123"
                                    value={addressForm.street}
                                    onChange={handleAddressChange}
                                    variant="bordered"
                                    errorMessage={errors.street}
                                    isInvalid={!!errors.street}
                                    isClearable
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Ciudad"
                                        name="city"
                                        placeholder="Ej: Barcelona"
                                        value={addressForm.city}
                                        onChange={handleAddressChange}
                                        variant="bordered"
                                        errorMessage={errors.city}
                                        isInvalid={!!errors.city}
                                        isClearable
                                    />
                                    <Input
                                        label="Provincia"
                                        name="state"
                                        placeholder="Ej: Barcelona"
                                        value={addressForm.state}
                                        onChange={handleAddressChange}
                                        variant="bordered"
                                        errorMessage={errors.state}
                                        isInvalid={!!errors.state}
                                        isClearable
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Código Postal"
                                        name="postalCode"
                                        placeholder="Ej: 08002"
                                        value={addressForm.postalCode}
                                        onChange={handleAddressChange}
                                        variant="bordered"
                                        errorMessage={errors.postalCode}
                                        isInvalid={!!errors.postalCode}
                                        isClearable
                                        maxLength="5"
                                    />
                                    <Input
                                        label="País"
                                        name="country"
                                        placeholder="Ej: España"
                                        value={addressForm.country}
                                        onChange={handleAddressChange}
                                        variant="bordered"
                                        errorMessage={errors.country}
                                        isInvalid={!!errors.country}
                                        isClearable
                                    />
                                </div>
                                <Input
                                    label="Teléfono"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="Ej: +34 123 456 789"
                                    value={addressForm.phoneNumber}
                                    onChange={handleAddressChange}
                                    variant="bordered"
                                    errorMessage={errors.phoneNumber}
                                    isInvalid={!!errors.phoneNumber}
                                    isClearable
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
                            <Button
                                color="primary"
                                onPress={saveAddress}
                                className="text-white"
                                isLoading={isSaving}
                                disabled={isSaving}
                            >
                                {editingAddressId ? "Guardar Cambios" : "Crear Dirección"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
