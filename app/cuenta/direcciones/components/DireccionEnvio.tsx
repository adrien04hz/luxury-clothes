"use client";

import { useState } from "react";
import FormularioDireccion from "./FormularioDireccion";
import { ListaDireccionEnvio } from "@/types/direccionesenvio/DireccionesEnvio";

type Props = {
  direccion: ListaDireccionEnvio;
  onRefresh: () => void;
};

export default function DireccionEnvio({ direccion, onRefresh }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDireccion, setSelectedDireccion] = useState<ListaDireccionEnvio | null>(null);

  const handleEdit = () => {
    setSelectedDireccion(direccion);
    setIsOpen(true);
  };

  // console.log("📍 DIRECCIÓN COMPLETA:", direccion);
  // console.log("🆔 ID DE DIRECCIÓN:", direccion.id);

  return (
    <div className="max-w-xl p-6 border border-gray-200 ">
      <h2 className="text-black font-semibold text-lg mb-2">
        Dirección de entrega
      </h2>

      <div className="flex justify-between items-start">
        <div className="text-[#757575] text-[16px] space-y-1">
          <p>
            {direccion.nombre} {direccion.apellido} {direccion.telefono}
          </p>
          <p>
            {direccion.calle} {direccion.numero_exterior}
            {direccion.numero_interior && ` Int. ${direccion.numero_interior}`} {direccion.colonia}
          </p>
          <p>
            {direccion.codigo_postal} {direccion.ciudad}, {direccion.estado}
          </p>
        </div>

        <button
          onClick={handleEdit}
          className="text-black text-sm font-bold underline"
        >
          Editar
        </button>

      </div>

      <FormularioDireccion
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedDireccion(null);
          onRefresh();
        }}
        onSubmit={(data) => {
          console.log("guardar:", data);
        }}
        selectedDireccion={selectedDireccion}
      />
    </div>
  );
}