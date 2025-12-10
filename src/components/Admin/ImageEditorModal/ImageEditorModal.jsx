import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
} from "@heroui/react";

export default function ImageEditorModal({ file, onSave, onClose }) {
  const imageRef = useRef(null);
  const cropperRef = useRef(null);

  const [aspectRatio, setAspectRatio] = useState(1);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!file) return;

    // Inicializar cropper
    const cropper = new Cropper(imageRef.current, {
      aspectRatio,
      viewMode: 1,
      autoCropArea: 1,
      background: false,
      responsive: true,
      ready() {
        // aplicar rotación inicial correcta
        cropper.rotateTo(rotation);
      },
    });

    cropperRef.current = cropper;
    setFlipX(1);
    setFlipY(1);
    setRotation(0);

    return () => {
      cropper.destroy();
      cropperRef.current = null;
    };
  }, [file, aspectRatio]);

  const cropper = () => cropperRef.current;

  const handleRotateStep = (step) => {
    if (!cropper()) return;
    // incrementamos ángulo interno y aplicamos rotateTo para evitar acumulación de errores
    const newAngle = rotation + step;
    setRotation(newAngle);
    cropper().rotateTo(newAngle);
  };

  const handleZoomStep = (delta) => {
    if (!cropper()) return;
    cropper().zoom(delta);
  };

  const handleFlipX = () => {
    if (!cropper()) return;
    const nx = flipX * -1;
    cropper().scaleX(nx);
    setFlipX(nx);
  };

  const handleFlipY = () => {
    if (!cropper()) return;
    const ny = flipY * -1;
    cropper().scaleY(ny);
    setFlipY(ny);
  };

  const handleSave = () => {
    if (!cropper()) return;
    // Obtener canvas y blob optimizado
    const canvas = cropper().getCroppedCanvas({
      // puedes configurar tamaño/qualuty aquí
      fillColor: "#fff",
    });
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob); // padre se encarga de transformar a File y reemplazar en FilePond
        }
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <Modal isOpen={!!file} onClose={onClose} size="4xl" backdrop="blur">
      <ModalContent>
        <ModalHeader className="text-xl font-semibold">
          Editar imagen
        </ModalHeader>

        <ModalBody>
          {/* Aspect Ratios */}
          <div className="flex gap-2 mb-4">
            <Button onPress={() => setAspectRatio(1)}>1:1</Button>
            <Button onPress={() => setAspectRatio(4 / 5)}>4:5</Button>
            <Button onPress={() => setAspectRatio(16 / 9)}>16:9</Button>
            <Button onPress={() => setAspectRatio(NaN)}>Libre</Button>
          </div>

          {/* Tools: Rotate, Zoom, Flip */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <Button onPress={() => handleRotateStep(-5)}>↺ Rotar -5°</Button>
            <Button onPress={() => handleRotateStep(5)}>↻ Rotar +5°</Button>

            <Button onPress={() => handleZoomStep(0.1)}>＋ Zoom</Button>
            <Button onPress={() => handleZoomStep(-0.1)}>－ Zoom</Button>

            <Button onPress={handleFlipX}>⇋ Flip H</Button>
            <Button onPress={handleFlipY}>⇅ Flip V</Button>
          </div>

          {/* Cropper */}
          <div className="max-h-[60vh] overflow-hidden rounded-lg shadow-lg">
            <img
              ref={imageRef}
              src={file ? URL.createObjectURL(file) : ""}
              alt="to-edit"
              className="max-w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="flat" color="danger" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleSave}>
              Guardar
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
