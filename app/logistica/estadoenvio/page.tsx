"use client"
import { useEffect } from "react";
import React, { useState } from 'react';
import { MapPin, Clock, RefreshCcw } from 'lucide-react';
import { EnvioPendiente } from '@/types/logistica/envio_pendiente';

export default function EnviosPendientes(){

  const [envioPendiente, setEnvioPendiente] = useState<EnvioPendiente[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  //Manejar actualizacion de estado de envio
  const [openModal, setOpenModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const getEstadoColor = (estado: EnvioPendiente["estado_envio"]): string => {
    switch (estado) {
      case "Pendiente": return "bg-green-500 text-white";
      case "Preparado": return "bg-green-700 text-white";
      case "Enviado": return "bg-blue-700 text-white";
      case "En Camino": return "bg-black text-white";
      default: return "bg-black text-white";
    }
  };


 const loadEnviosPendientes = async () => {
  try {
    const token = localStorage.getItem("token");

    const respuesta = await fetch("/api/logistica/envios", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.error || "Error al obtener pedidos");
    }

    const estadoenvios = data.data || [];

    const unicos = estadoenvios.filter(
      (envio: EnvioPendiente, index: number, self: EnvioPendiente[]) =>
        index === self.findIndex(e => e.id_pedido === envio.id_pedido)
    );
    console.log(respuesta);

    setEnvioPendiente(unicos);

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadEnviosPendientes();
  }, []);

  const estadosMap: Record<string, number> = {
  Pendiente: 1,
  Preparado: 2,
  Enviado: 3,
  "En Camino": 4,
  Entregado: 5
};
  const actualizarEstado = async () => {
  try {
    const token = localStorage.getItem("token");

    const idUsuarioLogistica = 1; // o sacarlo del JWT si quieres hacerlo PRO

    const res = await fetch("/api/logistica/estado_envio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        idPedido: pedidoSeleccionado,
        idNuevoEstado: estadosMap[nuevoEstado],
        idUsuarioLogistica
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    setOpenModal(false);
    setNuevoEstado("");

    // 🔥 recargar lista
    loadEnviosPendientes();

  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <div className=" pl-8 bg-gray-50 font-sans pb-10">
      <main className="p-6 ">
        <h2 className="text-2xl font-bold">
            Tus envíos pendientes
        </h2>
        <p className="text-gray-500 text-sm mt-1">
            Gestiona y confirma el estado de tus envios pendientes
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {envioPendiente.map((envio) => (
          <div key={envio.id_pedido} className="bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            
              {/* Estado */}
              <div className={`absolute top-0 right-0 px-4 py-1 text-[12px] font-semibold uppercase tracking-widest ${getEstadoColor(envio.estado_envio)}`}>
                {envio.estado_envio}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    ID: {envio.numero_guia}
                  </span>

                  <h3 className="text-2xl font-bold uppercase mt-1 ">
                    {envio.cliente_nombre} {envio.cliente_apellido}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 mb-6 border-l-2 border-gray-200 pl-2">
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={14} className="text-black" />
                  <p className="text-sm font-bold uppercase tracking-tighter">
                    Estimación de entrega: <span className="text-black font-black">
                      {new Date(envio.fecha_estimada).toLocaleString()}
                      </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPedidoSeleccionado(envio.id_pedido);
                  setOpenModal(true);
                }}
                className={`flex items-center justify-center gap-2 font-black p-4 text-xs uppercase tracking-widest transition shadow-lg rounded-full ${
                  envio.estado_envio === "Entregado" 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-gray-800 active:scale-95"
                }`}
              >
                Modificar estado
              </button>
            </div>
          ))}
        </section>

          {openModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-80 space-y-4">

      <h3 className="text-lg font-bold">Cambiar estado</h3>

      <select
        className="w-full border p-2 rounded"
        value={nuevoEstado}
        onChange={(e) => setNuevoEstado(e.target.value)}
      >
        <option value="">Selecciona estado</option>
        <option value="Preparado">Preparado</option>
        <option value="Enviado">Enviado</option>
        <option value="En Camino">En Camino</option>
        <option value="Entregado">Entregado</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setOpenModal(false)}
          className="px-4 py-2 text-sm"
        >
          Cancelar
        </button>

        <button
          onClick={async () => {
            await actualizarEstado();
          }}
          className="bg-black text-white px-4 py-2 text-sm rounded"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}
  
 
      </main>
    </div>

    
  );
 
};
