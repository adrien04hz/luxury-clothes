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
    <div className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition">

      {/* HEADER */}
      <h2 className="text-black font-semibold text-lg mb-3">
        Dirección de entrega
      </h2>

      {/* CONTENT */}
      <div className="flex justify-between items-start gap-4">

        <div className="text-sm text-gray-700 space-y-1">
          <p className="font-semibold text-black">
            {direccion.nombre} {direccion.apellido}
          </p>

          <p>
            Calle {direccion.calle} {direccion.numero_exterior}
            {direccion.numero_interior && ` Int. ${direccion.numero_interior}`},  {direccion.colonia}
          </p>

          <p>
            CP: {direccion.codigo_postal} {direccion.ciudad}, {direccion.estado}
          </p>

          <p className="text-gray-500">
            Tel: {direccion.telefono}
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