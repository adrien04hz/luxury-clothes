"use client";

import { useState } from "react";
import FormularioDireccion from "./FormularioDireccion";
import { ListaDireccionEnvio } from "@/types/direccionesenvio/DireccionesEnvio";

type Props = {
  direccion: ListaDireccionEnvio;
};

export default function DireccionEnvio({ direccion }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDireccion, setSelectedDireccion] =
    useState<ListaDireccionEnvio | null>(null);

  const handleEdit = () => {
    setSelectedDireccion(direccion);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setSelectedDireccion(null);
    setIsOpen(true);
  };

  return (
    <div className="max-w-xl border-b py-6">

      <h2 className="text-black font-semibold text-lg mb-2">
        Dirección de entrega
      </h2>

      <div className="flex justify-between items-start">

        <div className="text-[#757575] text-[16px] space-y-1">
          <p>
            {direccion.nombre} {direccion.apellido}
          </p>
          <p>
            {direccion.calle} {direccion.numero_exterior}
            {direccion.numero_interior && ` Int. ${direccion.numero_interior}`}
          </p>
          <p>{direccion.colonia}</p>
          <p>
            {direccion.codigo_postal} {direccion.ciudad}
          </p>
          <p>{direccion.estado}</p>
        </div>

        <button
          onClick={handleEdit}
          className="text-black text-sm font-bold underline"
        >
          Editar
        </button>

      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          Agregar nueva
        </button>
      </div>

      <FormularioDireccion
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedDireccion(null);
        }}
        onSubmit={(data) => {
          console.log("guardar:", data);
        }}
        selectedDireccion={selectedDireccion}
      />
    </div>
  );
}