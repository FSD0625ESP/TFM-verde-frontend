import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { getAllProductsByStoreId } from "../../../services/api";

import { Edit, Trash2, Store, Tag, Star, Eye, EyeOff } from "lucide-react";

export default function ProductsPage() {
  const { sellerStore } = useOutletContext();

  console.log("sellerStore", sellerStore._id);

  const [productsByStore, setProductsByStore] = useState([]);
  const fetchStoreProducts = async () => {
    console.log("fetch - sellerStore ID", sellerStore._id);
    try {
      const data = await getAllProductsByStoreId(sellerStore._id);
      setProductsByStore(data);
    } catch (error) {
      console.error("Error al obtener los productos de la tienda:", error);
    }
  };

  useEffect(() => {
    if (sellerStore) {
      fetchStoreProducts();
      console.log("useEffect launched");
    }
  }, [sellerStore]);

  return (
    <>
      <div className="w-full">
        <h3 class="text-xl font-semibold mb-2">Listado de Productos</h3>
        <p class="text-gray-700">
          Estos son los productos que hay en la tienda:
        </p>
        {productsByStore.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-3">
            <p className="text-gray-600 text-lg">Aún no hay ningún producto.</p>

            <Link
              to="/store-admin/productos/nuevo"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-800 transition"
            >
              Añadir el primer producto
            </Link>
          </div>
        )}
        {productsByStore.length > 0 && (
          <div className="flex flex-col gap-4 pt-5">
            {productsByStore.map((p) => (
              <div
                key={p._id}
                className="w-full flex flex-row gap-3 justify-between items-center bg-white shadow rounded-xl p-2 hover:bg-primary/20 duration-300"
              >
                {/* --- IZQUIERDA: Imagen + título --- */}
                <div className="flex items-center gap-3">
                  <img
                    src={p.images[0]}
                    alt=""
                    className="shadow rounded-xl w-[55px] h-[55px] object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      {/* Tipo de producto: venta / exposición */}
                      {p.status === "onSale" && (
                        <div className="flex items-center gap-1">
                          <Store size={14} className="text-green-600" />
                          <span>Venta</span>
                        </div>
                      )}
                      {p.status === "exhibition" && (
                        <div className="flex items-center gap-1">
                          <Store size={14} className="text-blue-600" />
                          <span>Exposición</span>
                        </div>
                      )}
                      {p.status === "disabled" && (
                        <div className="flex items-center gap-1">
                          <EyeOff size={14} className="text-gray-500" />
                          <span>Deshabilitado</span>
                        </div>
                      )}

                      {/* Oferta */}
                      {p.oferta && (
                        <div className="flex items-center gap-1">
                          <Tag size={14} className="text-red-600" />
                          <span>Oferta</span>
                        </div>
                      )}

                      {/* Destacado */}
                      {p.destacado && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" />
                          <span>Destacado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- DERECHA: Botones --- */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => console.log("Editar", p._id)}
                    className="p-2 rounded-lg hover:bg-primary/20 transition"
                  >
                    <Edit size={18} className="text-primary-700" />
                  </button>

                  <button
                    onClick={() => console.log("Eliminar", p._id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
