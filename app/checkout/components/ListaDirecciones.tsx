"use client";

import { ListaDireccionEnvio } from "@/types/direccionesenvio/DireccionesEnvio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  direcciones: ListaDireccionEnvio[];
  onSelect: (dir: ListaDireccionEnvio) => void;
}

export default function ListaDirecciones({
  isOpen,
  onClose,
  direcciones,
  onSelect,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
        
        <h2 className="text-xl font-semibold mb-4">
          Seleccionar dirección
        </h2>

        <div className="space-y-4">
          {direcciones.map((dir) => (
            <div
              key={dir.id}
              className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelect(dir);
                onClose();
              }}
            >
              <p className="font-medium">
                {dir.nombre} {dir.apellido}
              </p>
              <p className="text-sm text-gray-600">
                {dir.calle} {dir.numero_exterior}, {dir.colonia}
              </p>
              <p className="text-sm text-gray-600">
                {dir.codigo_postal} {dir.ciudad}, {dir.estado}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}