import React, { useContext, useState } from 'react';
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Textarea,
    Select,
    SelectItem,
    addToast,
} from '@heroui/react';
import { Flag } from 'lucide-react';
import { createStoreReport } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Botón para reportar una tienda con modal de HeroUI
 */
const ReportStoreButton = ({ storeId, storeName, variant = "flat", size = "md", className = "" }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reasons = [
        { value: "spam", label: "Spam o contenido no deseado" },
        { value: "inappropriate", label: "Contenido inapropiado u ofensivo" },
        { value: "other", label: "Otro motivo" },
    ];

    const handleOpenModal = () => {
        if (!user) {
            addToast({
                title: "Inicia sesión",
                description: "Necesitas iniciar sesión para reportar una tienda",
                color: "warning",
                duration: 4000,
            });
            navigate('/login');
            return;
        }
        onOpen();
    };

    const handleSubmit = async () => {
        if (!reason) {
            addToast({
                title: "Selecciona un motivo",
                description: "Por favor, selecciona una razón para el reporte",
                color: "warning",
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await createStoreReport(user._id, storeId, reason, description);

            addToast({
                title: "Reporte enviado",
                description: "Gracias por tu reporte. Lo revisaremos pronto.",
                color: "success",
                duration: 4000,
            });

            // Resetear formulario y cerrar modal
            setReason("");
            setDescription("");
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Error al enviar el reporte";
            addToast({
                title: "Error",
                description: errorMsg,
                color: "danger",
                duration: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                color="danger"
                startContent={<Flag size={18} />}
                onPress={handleOpenModal}
                className={className}
            >
                Reportar
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="md"
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold">Reportar tienda</h3>
                                <p className="text-sm font-normal text-gray-600">
                                    {storeName}
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Select
                                        label="Motivo del reporte"
                                        placeholder="Selecciona un motivo"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        isRequired
                                        variant="bordered"
                                    >
                                        {reasons.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Textarea
                                        label="Descripción (opcional)"
                                        placeholder="Proporciona más detalles sobre el reporte..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        variant="bordered"
                                        minRows={3}
                                        maxRows={6}
                                    />

                                    <p className="text-xs text-gray-500">
                                        Tu reporte será revisado por nuestro equipo. Los reportes falsos pueden resultar en la suspensión de tu cuenta.
                                    </p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                    isDisabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleSubmit}
                                    isLoading={isSubmitting}
                                >
                                    Enviar reporte
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ReportStoreButton;
