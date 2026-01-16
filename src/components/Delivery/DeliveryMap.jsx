import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Spinner } from "@heroui/react";
import { getDeliveryByOrderId } from "../../services/api";
import { useSocket } from "../../contexts/SocketContext";

const formatEta = (eta) => {
    if (!eta) return "";
    const d = new Date(eta);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
};

export default function DeliveryMap({ orderId, className = "" }) {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const courierMarkerRef = useRef(null);
    const mountedRef = useRef(true);
    const hasAutoFitRef = useRef(false);
    const userInteractedRef = useRef(false);

    const { isConnected, joinDelivery, onDeliveryUpdate } = useSocket();

    const [loading, setLoading] = useState(true);
    const [delivery, setDelivery] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Reset del autoadjust cuando cambiamos de pedido
    useEffect(() => {
        hasAutoFitRef.current = false;
        userInteractedRef.current = false;
    }, [orderId]);

    const routeGeoJson = useMemo(() => {
        const coords = (delivery?.route || []).map((p) => [p.lng, p.lat]);
        if (coords.length < 2) return null;
        return {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords },
        };
    }, [delivery?.route]);

    const currentLngLat = useMemo(() => {
        const p = delivery?.currentLocation;
        if (p && typeof p.lng === "number" && typeof p.lat === "number") return [p.lng, p.lat];

        const route = delivery?.route;
        const idx = delivery?.currentIndex;
        if (!Array.isArray(route) || route.length === 0) return null;

        const safeIndex = typeof idx === "number" ? Math.max(0, Math.min(idx, route.length - 1)) : 0;
        const rp = route[safeIndex];
        if (!rp || typeof rp.lng !== "number" || typeof rp.lat !== "number") return null;
        return [rp.lng, rp.lat];
    }, [delivery?.currentLocation, delivery?.route, delivery?.currentIndex]);

    // 1) Obtener delivery por orderId
    useEffect(() => {
        let mounted = true;
        const run = async () => {
            if (!orderId) return;
            setLoading(true);
            setError("");
            try {
                const d = await getDeliveryByOrderId(orderId);
                if (!mounted) return;
                setDelivery(d);
            } catch {
                if (!mounted) return;
                setError("No se pudo cargar el tracking del pedido.");
                setDelivery(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        run();
        return () => {
            mounted = false;
        };
    }, [orderId]);

    // 2) Suscribirse por socket al delivery
    useEffect(() => {
        if (!delivery?._id) return;
        if (!isConnected) return;
        joinDelivery(delivery._id);
    }, [delivery?._id, isConnected, joinDelivery]);

    useEffect(() => {
        if (!delivery?._id) return;
        const cleanup = onDeliveryUpdate((payload) => {
            if (!payload?.deliveryId) return;
            if (payload.deliveryId !== delivery._id.toString()) return;
            setDelivery((prev) => ({
                ...(prev || {}),
                ...payload,
            }));
        });
        return cleanup;
    }, [delivery?._id, onDeliveryUpdate]);

    // 3) Inicializar mapa
    useEffect(() => {
        if (!token) return;
        if (loading) return;
        if (!containerRef.current) return;
        if (mapRef.current) return;

        mapboxgl.accessToken = token;

        // Evita ruido de consola y requests de analítica (a menudo bloqueados por adblockers).
        try {
            if (typeof mapboxgl.setTelemetryEnabled === "function") {
                mapboxgl.setTelemetryEnabled(false);
            }
        } catch {
            // noop
        }

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [2.1734, 41.3851],
            zoom: 12,
            pitch: 60,
            bearing: -17.6,
            antialias: true,
        });

        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Si el usuario toca el mapa, dejamos de auto-centrar.
        const markUserInteracted = () => {
            userInteractedRef.current = true;
        };
        map.on("dragstart", markUserInteracted);
        map.on("zoomstart", markUserInteracted);
        map.on("rotatestart", markUserInteracted);
        map.on("pitchstart", markUserInteracted);

        map.on("error", (ev) => {
            // Importante para detectar tokens inválidos, CORS, bloqueos de red, etc.
            const message = ev?.error?.message || ev?.error?.toString?.() || "";
            if (!message) return;
            console.warn("[DeliveryMap] Mapbox error:", ev.error);
            if (!mountedRef.current) return;
            // No pisamos errores de API/delivery si ya existen.
            setError((prev) => prev || "No se pudo cargar el mapa (Mapbox). Revisa tu token o bloqueadores.");
        });

        map.once("load", () => {
            // Si el contenedor se monta dentro de layouts flex/grids, esto evita el mapa en blanco.
            map.resize();

            // ===== 3D: terreno + cielo + edificios =====
            try {
                if (!map.getSource("mapbox-dem")) {
                    map.addSource("mapbox-dem", {
                        type: "raster-dem",
                        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                        tileSize: 512,
                        maxzoom: 14,
                    });
                }

                map.setTerrain({ source: "mapbox-dem", exaggeration: 1.2 });

                if (!map.getLayer("sky")) {
                    map.addLayer({
                        id: "sky",
                        type: "sky",
                        paint: {
                            "sky-type": "atmosphere",
                            "sky-atmosphere-sun": [0.0, 0.0],
                            "sky-atmosphere-sun-intensity": 15,
                        },
                    });
                }

                if (!map.getLayer("3d-buildings")) {
                    const layers = map.getStyle()?.layers || [];
                    const labelLayerId = layers.find(
                        (l) => l.type === "symbol" && l.layout && l.layout["text-field"]
                    )?.id;

                    map.addLayer(
                        {
                            id: "3d-buildings",
                            source: "composite",
                            "source-layer": "building",
                            filter: ["==", "extrude", "true"],
                            type: "fill-extrusion",
                            minzoom: 15,
                            paint: {
                                "fill-extrusion-color": "#aaa",
                                "fill-extrusion-height": ["get", "height"],
                                "fill-extrusion-base": ["get", "min_height"],
                                "fill-extrusion-opacity": 0.6,
                            },
                        },
                        labelLayerId
                    );
                }
            } catch (e) {
                console.warn("[DeliveryMap] No se pudo activar 3D:", e);
            }
        });

        return () => {
            map.off("dragstart", markUserInteracted);
            map.off("zoomstart", markUserInteracted);
            map.off("rotatestart", markUserInteracted);
            map.off("pitchstart", markUserInteracted);
            map.remove();
            mapRef.current = null;
            courierMarkerRef.current = null;
        };
    }, [token, loading]);

    // 4) Pintar/actualizar ruta y markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        if (!delivery) return;

        const origin = delivery.origin ? [delivery.origin.lng, delivery.origin.lat] : null;
        const destination = delivery.destination ? [delivery.destination.lng, delivery.destination.lat] : null;

        const ensureMarker = (id, lngLat, color) => {
            if (!lngLat) return;
            const existing = map.__customMarkers?.[id];
            if (existing) {
                existing.setLngLat(lngLat);
                return;
            }
            const el = document.createElement("div");
            el.style.width = "12px";
            el.style.height = "12px";
            el.style.borderRadius = "999px";
            el.style.background = color;
            el.style.border = "2px solid white";
            el.style.boxSizing = "border-box";
            const marker = new mapboxgl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
            map.__customMarkers = map.__customMarkers || {};
            map.__customMarkers[id] = marker;
        };

        ensureMarker("origin", origin, "#10b981");
        ensureMarker("destination", destination, "#f59e0b");

        if (currentLngLat) {
            if (!courierMarkerRef.current) {
                const el = document.createElement("div");
                el.textContent = "🚚";
                el.style.fontSize = "32px";
                el.style.lineHeight = "1";
                courierMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat(currentLngLat).addTo(map);
            } else {
                courierMarkerRef.current.setLngLat(currentLngLat);
            }
        }

        const sourceId = "delivery-route";
        const layerId = "delivery-route-layer";

        const upsertRoute = () => {
            if (!routeGeoJson) return;

            const src = map.getSource(sourceId);
            if (!src) {
                map.addSource(sourceId, { type: "geojson", data: routeGeoJson });
                map.addLayer({
                    id: layerId,
                    type: "line",
                    source: sourceId,
                    paint: {
                        "line-color": "#2563eb",
                        "line-width": 4,
                    },
                });

                // map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            } else {
                src.setData(routeGeoJson);
            }
        };

        if (map.isStyleLoaded()) {
            upsertRoute();
        } else {
            map.once("load", upsertRoute);
        }

        // Ajustar viewport SOLO una vez (y mientras el usuario no haya interactuado)
        if (!hasAutoFitRef.current && !userInteractedRef.current) {
            const bounds = new mapboxgl.LngLatBounds();
            [origin, destination].filter(Boolean).forEach((p) => bounds.extend(p));
            if (!bounds.isEmpty()) {
                const doFit = () => {
                    if (hasAutoFitRef.current || userInteractedRef.current) return;
                    map.fitBounds(bounds, { padding: 60, duration: 600 });
                    hasAutoFitRef.current = true;
                };

                if (map.isStyleLoaded()) {
                    doFit();
                } else {
                    map.once("load", doFit);
                }
            }
        }
    }, [delivery, routeGeoJson, currentLngLat]);

    if (!token) {
        return (
            <div className={`w-full bg-white rounded-2xl shadow-md p-6 ${className}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguimiento del reparto</h3>
                <p className="text-sm text-gray-600">
                    Falta configurar <strong>VITE_MAPBOX_ACCESS_TOKEN</strong> en el frontend.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`w-full bg-white rounded-2xl shadow-md p-8 ${className}`}>
                <div className="flex items-center gap-3">
                    <Spinner size="sm" color="primary" />
                    <p className="text-sm text-gray-600">Cargando tracking…</p>
                </div>
            </div>
        );
    }

    if (error || !delivery) {
        return (
            <div className={`w-full bg-white rounded-2xl shadow-md p-6 ${className}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguimiento del reparto</h3>
                <p className="text-sm text-gray-600">{error || "Tracking no disponible."}</p>
            </div>
        );
    }

    const statusLabel =
        delivery.status === "on_route" ? "En ruta" : delivery.status === "delivered" ? "Entregado" : "Pendiente";

    return (
        <div className={`w-full bg-white rounded-2xl shadow-md p-6 mt-8 ${className}`}>
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seguimiento del reparto</h3>
                    <p className="text-sm text-gray-600">Estado: {statusLabel}{delivery.eta ? ` · ETA ${formatEta(delivery.eta)}` : ""}</p>
                </div>
            </div>

            <div ref={containerRef} className="w-full h-[360px] rounded-xl overflow-hidden border border-gray-200" />
        </div>
    );
}
