"use client";

import { ListaDireccionEnvio } from "@/types/direccionesenvio/DireccionesEnvio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  direcciones: ListaDireccionEnvio[];
  onSelect: (dir: ListaDireccionEnvio) => void;
  selectedId?: number; // 👈 para marcar la seleccionada
}

export default function ListaDirecciones({
  isOpen,
  onClose,
  direcciones,
  onSelect,
  selectedId,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto overflow-hidden shadow-2xl">

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-1">
          Seleccionar dirección
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Elige dónde quieres recibir tu pedido
        </p>

        {/* LISTA */}
        <div className="space-y-4">
          {direcciones.map((dir) => (
            <div
              key={dir.id}
              onClick={() => {
                onSelect(dir);
                onClose();
              }}
              className={`
                border p-5 rounded-xl cursor-pointer transition
                ${dir.id === selectedId
                  ? "border-black bg-gray-100 shadow-sm"
                  : "border-gray-200 hover:border-black hover:shadow-md hover:bg-gray-50 hover:scale-[1.01]"
                }
              `}
            >
              <div className="flex justify-between items-start">

                {/* INFO */}
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold text-black">
                    {dir.nombre} {dir.apellido}
                  </p>

                  <p>
                    <span className="font-medium text-gray-500">Dirección: </span>
                    {dir.calle} {dir.numero_exterior}
                    {dir.numero_interior && ` Int. ${dir.numero_interior}`}  {dir.colonia}
                  </p>

                  {/* <p>
                    <span className="font-medium text-gray-500">Colonia: </span>
                    {dir.colonia}
                  </p> */}

                  <p>
                    <span className="font-medium text-gray-500">Ciudad: </span>
                    {dir.ciudad}, {dir.estado}
                  </p>

                  <p>
                    <span className="font-medium text-gray-500">CP: </span>
                    {dir.codigo_postal}
                  </p>
                </div>

                {/* INDICADOR */}
                {dir.id === selectedId && (
                  <span className="text-xs font-medium text-black">
                    Seleccionada
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white pt-4 mt-6 flex justify-end ">
            <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-black text-white hover:opacity-80 transition"
            >
                Cerrar
            </button>
            </div>
      </div>
    </div>
  );
}