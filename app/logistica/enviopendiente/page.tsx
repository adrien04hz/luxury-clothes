"use client"
import React, { useState } from 'react';
import { MapPin, Clock, RefreshCcw } from 'lucide-react';

// 1. Definimos la estructura exacta basada en tu DB
interface Envio {
  id_envio: number;
  numero_guia: string;
  cliente: string;
  calle: string;
  numero_exterior: string;
  colonia: string;
  estado: "Pendiente" | "En Camino" | "Entregado" | "Fallido"; // Tipos literales
  fecha_estimada: string;
}

const NikeLogisticsDashboard: React.FC = () => {
  // 2. Le decimos a useState que usará un array de nuestra interface
  const [envios, setEnvios] = useState<Envio[]>([
    {
      id_envio: 1,
      numero_guia: "NK-77420-MEX",
      cliente: "Carlos Rodriguez",
      calle: "Av. Paseo de la Reforma",
      numero_exterior: "222",
      colonia: "Juárez",
      estado: "Pendiente",
      fecha_estimada: "14:30 PM"
    },
  ]);

  // 3. Tipamos el parámetro 'id' como number
  const cambiarEstado = (id: number): void => {
    const estados: Envio["estado"][] = ["Pendiente", "En Camino", "Entregado", "Fallido"];
    
    setEnvios(prevEnvios => 
      prevEnvios.map((envio: Envio) => {
        if (envio.id_envio === id) {
          const currentIndex = estados.indexOf(envio.estado);
          const nextIndex = (currentIndex + 1) % estados.length;
          return { ...envio, estado: estados[nextIndex] };
        }
        return envio;
      })
    );
  };

  // 4. Tipamos 'estado' con el tipo específico de la interface
  const getEstadoColor = (estado: Envio["estado"]): string => {
    switch (estado) {
      case "Entregado": return "bg-green-500 text-white";
      case "En Camino": return "bg-blue-600 text-white";
      case "Fallido": return "bg-red-600 text-white";
      default: return "bg-black text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <main className="p-6 max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Entregas pendientes</h2>
        </header>

        <section className="space-y-6">
          {envios.map((envio) => (
            <div key={envio.id_envio} className="bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              {/* Indicador de Estado Superior */}
              <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest ${getEstadoColor(envio.estado)}`}>
                {envio.estado}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    ID: {envio.numero_guia}
                  </span>
                  <h3 className="text-2xl font-black uppercase mt-1 tracking-tight">
                    {envio.cliente}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 mb-6 border-l-2 border-gray-100 pl-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} className="text-black" />
                  <p className="text-sm font-medium">
                    {envio.calle} #{envio.numero_exterior}, {envio.colonia}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={14} className="text-black" />
                  <p className="text-sm font-bold uppercase tracking-tighter">
                    Ventana: <span className="text-black font-black">{envio.fecha_estimada}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Botón Principal de Acción con rounded-full */}
                <button 
                  disabled={envio.estado === "Entregado"}
                  className={`flex items-center justify-center gap-2 font-black py-4 text-xs uppercase tracking-widest transition shadow-lg rounded-full ${
                    envio.estado === "Entregado" 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-800 active:scale-95"
                  }`}
                >
                  Confirmar Entrega
                </button>

                {/* Botón de Modificar Estado con rounded-full */}
                <button 
                  onClick={() => cambiarEstado(envio.id_envio)}
                  className="flex items-center justify-center gap-2 border-2 border-black text-black font-semibold py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition active:scale-95 rounded-full"
                >
                  <RefreshCcw size={14} />
                  Cambiar Estado
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default NikeLogisticsDashboard;