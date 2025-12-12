import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import {
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

const AlertMessage = ({ alert, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(true);
    }, [alert.id]);

    const getIcon = () => {
        switch (alert.type) {
            case "success":
                return <CheckCircle2 size={24} className="text-green-500" />;
            case "danger":
                return <AlertCircle size={24} className="text-red-500" />;
            case "warning":
                return <AlertTriangle size={24} className="text-yellow-500" />;
            case "info":
            default:
                return <Info size={24} className="text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (alert.type) {
            case "success":
                return "bg-green-50 border-green-200";
            case "danger":
                return "bg-red-50 border-red-200";
            case "warning":
                return "bg-yellow-50 border-yellow-200";
            case "info":
            default:
                return "bg-blue-50 border-blue-200";
        }
    };

    const getTextColor = () => {
        switch (alert.type) {
            case "success":
                return "text-green-800";
            case "danger":
                return "text-red-800";
            case "warning":
                return "text-yellow-800";
            case "info":
            default:
                return "text-blue-800";
        }
    };

    const getButtonColor = () => {
        switch (alert.type) {
            case "success":
                return "success";
            case "danger":
                return "danger";
            case "warning":
                return "warning";
            case "info":
            default:
                return "primary";
        }
    };

    // Render Dialog
    if (alert.isDialog) {
        return (
            <Modal
                isOpen={isVisible}
                onOpenChange={setIsVisible}
                backdrop="blur"
                size="sm"
                className="pointer-events-auto"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-2">
                            {getIcon()}
                            <span>{alert.title}</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>{alert.message}</ModalBody>
                    <ModalFooter className="gap-2">
                        <Button
                            color="default"
                            variant="bordered"
                            onPress={() => {
                                alert.onCancel?.();
                                setIsVisible(false);
                                onClose();
                            }}
                        >
                            {alert.cancelText}
                        </Button>
                        <Button
                            color={getButtonColor()}
                            onPress={() => {
                                alert.onConfirm?.();
                                setIsVisible(false);
                                onClose();
                            }}
                        >
                            {alert.confirmText}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }

    // Render Toast notification
    return (
        <div
            className={`pointer-events-auto transform transition-all duration-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-96"
                }`}
        >
            <Card className={`border ${getBgColor()}`}>
                <CardBody className="flex-row items-start gap-3 p-4">
                    <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
                    <div className="flex-1 min-w-0">
                        {alert.title && (
                            <p className={`font-semibold ${getTextColor()}`}>{alert.title}</p>
                        )}
                        <p className={`text-sm ${getTextColor()}`}>{alert.message}</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    >
                        <X size={20} className={getTextColor()} />
                    </button>
                </CardBody>
            </Card>
        </div>
    );
};

export default AlertMessage;
