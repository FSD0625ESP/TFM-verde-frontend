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

const CROP_PRESETS = {
  square: {
    label: "Cuadrada",
    minWidth: 400,
    minHeight: 400,
    aspectRatio: 1,
  },
  product: {
    label: "Producto",
    minWidth: 800,
    minHeight: 600,
    aspectRatio: 4 / 5,
  },
  hero: {
    label: "Hero",
    minWidth: 1600,
    minHeight: 900,
    aspectRatio: 16 / 9,
  },
};

export default function ImageEditorModal({
  file,
  onSave,
  onClose,
  preset = "square",
}) {
  const imageRef = useRef(null);
  const cropperRef = useRef(null);
  const okTimeoutRef = useRef(null);

  const activePreset = CROP_PRESETS[preset] ?? CROP_PRESETS.square;

  const MIN_WIDTH = activePreset.minWidth;
  const MIN_HEIGHT = activePreset.minHeight;

  const SCALE_FACTOR = 1.5;

  const MAX_WIDTH = Math.round(MIN_WIDTH * SCALE_FACTOR);
  const MAX_HEIGHT = Math.round(MIN_HEIGHT * SCALE_FACTOR);

  const [aspectRatio, setAspectRatio] = useState(activePreset.aspectRatio);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [cropInfo, setCropInfo] = useState(null);
  const [sizeStatus, setSizeStatus] = useState("idle"); // idle | error | ok

  useEffect(() => {
    setAspectRatio(activePreset.aspectRatio);
  }, [preset]);

  useEffect(() => {
    if (!file) return;

    // Inicializar cropper
    const cropper = new Cropper(imageRef.current, {
      aspectRatio,
      viewMode: 1,
      autoCropArea: 1,
      background: false,
      responsive: true,

      crop(event) {
        // event.detail contiene width/height reales
        const { width, height } = event.detail;

        const w = Math.round(width);
        const h = Math.round(height);

        setCropInfo({ width: w, height: h });

        if (w < MIN_WIDTH || h < MIN_HEIGHT) {
          // tamaño inválido → cancelar cualquier timeout pendiente
          if (okTimeoutRef.current) {
            clearTimeout(okTimeoutRef.current);
            okTimeoutRef.current = null;
          }

          setSizeStatus("error");
        } else {
          // tamaño válido
          setSizeStatus("ok");

          // limpiar timeout previo por seguridad
          if (okTimeoutRef.current) {
            clearTimeout(okTimeoutRef.current);
          }

          okTimeoutRef.current = setTimeout(() => {
            setSizeStatus("idle");
            okTimeoutRef.current = null;
          }, 2000);
        }
      },

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

    const { width, height } = cropInfo;

    // Bloquear si es demasiado pequeño
    if (width < MIN_WIDTH || height < MIN_HEIGHT) {
      setSizeStatus("error");
      return;
    }

    let outputWidth = width;
    let outputHeight = height;

    // Reescalar si supera el 150%
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

      outputWidth = Math.round(width * scale);
      outputHeight = Math.round(height * scale);
    }

    // Obtener canvas y blob optimizado
    const canvas = cropper().getCroppedCanvas({
      width: outputWidth,
      height: outputHeight,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
      fillColor: "#fff",
    });
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob); // padre se encarga de transformar a File y reemplazar en FilePond
        }
      },
      "image/jpeg",
      0.9
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
          {/*
          <div className="flex gap-2 mb-4">
            <Button onPress={() => setAspectRatio(1)}>1:1</Button>
            <Button onPress={() => setAspectRatio(4 / 5)}>4:5</Button>
            <Button onPress={() => setAspectRatio(16 / 9)}>16:9</Button>
            <Button onPress={() => setAspectRatio(NaN)}>Libre</Button>
          </div>
          */}

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
          <div className="max-h-[50vh] overflow-hidden rounded-t-lg shadow-lg">
            <img
              ref={imageRef}
              src={file ? URL.createObjectURL(file) : ""}
              alt="to-edit"
              className="max-w-full"
            />
          </div>
          {cropInfo && (
            <div
              className={`mt-[-12px] text-center text-sm font-medium px-3 py-2 rounded-b-lg transition-all duration-200
              ${
                sizeStatus === "error"
                  ? "bg-red-100 text-red-700"
                  : sizeStatus === "ok"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Tamaño del recorte:{" "}
              <strong>
                {cropInfo.width} × {cropInfo.height}px
              </strong>
              {sizeStatus === "error" && (
                <div className="mt-1 text-xs">
                  ⚠️ Tamaño mínimo requerido: {MIN_WIDTH} × {MIN_HEIGHT}px
                </div>
              )}
              {cropInfo &&
                sizeStatus !== "error" &&
                (() => {
                  const scale = Math.min(
                    MAX_WIDTH / cropInfo.width,
                    MAX_HEIGHT / cropInfo.height,
                    1
                  );

                  const outputWidth = Math.round(cropInfo.width * scale);
                  const outputHeight = Math.round(cropInfo.height * scale);

                  return (
                    <div className="mt-1 text-xs opacity-90">
                      ℹ️ La imagen se exportará a{" "}
                      <strong>
                        {outputWidth} × {outputHeight}px
                      </strong>
                    </div>
                  );
                })()}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2 mb-2">
            <Button variant="flat" color="danger" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              isDisabled={sizeStatus === "error"}
              aria-disabled={sizeStatus === "error"}
              className={
                sizeStatus === "error"
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              Guardar
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
