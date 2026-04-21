"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InfoPedidoRepartidorPage() {
  const { id_pedido } = useParams();
  const router = useRouter();

  const [pedido, setPedido] = useState<any>(null);
  const [error, setError] = useState("");

  const [nuevoEstado, setNuevoEstado] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/logistica/pedido/${id_pedido}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("Data del pedido: ", data); 

        if (!res.ok) {
          throw new Error(data.error || "Error al obtener pedido");
        }

        console.log("Pedido:", data); // 🔥 DEBUG
        setPedido(data);

      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id_pedido) fetchPedido();
  }, [id_pedido]);

  const actualizarEstado = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID") || localStorage.getItem("userId");

      console.log("userID:", userID); // 🔥 DEBUG
  
      if (!userID) {
        throw new Error("Usuario no identificado");
      }
  
      if (!nuevoEstado) {
        throw new Error("Selecciona un estado");
      }
  
      const res = await fetch("/api/logistica/estado_pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idPedido: Number(id_pedido),
          idNuevoEstado: Number(nuevoEstado),
          idUsuarioLogistica: Number(userID),
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error);
      }
  
      setMensaje("Estado actualizado correctamente");
  
      // recargar datos
      window.location.reload();
  
    } catch (err: any) {
      setMensaje(err.message);
    }
  };

  return (
  <div className="p-6 max-w-3xl mx-auto">

    {/* 🔙 BOTÓN */}
    <button
      onClick={() => router.back()}
      className="mb-4 text-sm text-gray-600 hover:underline"
    >
      ← Regresar
    </button>

    <h1 className="text-2xl font-semibold mb-6">
      Información del pedido
    </h1>

    {error && <p className="text-red-500">{error}</p>}
    {!pedido && !error && <p>Cargando...</p>}

    {pedido && (
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">

        {/* 🟣 ESTADO */}
        <div className="inline-block px-4 py-1 rounded-full text-white text-sm font-medium bg-purple-600">
          {pedido.estado_actual || "Sin estado"}
        </div>

        {/* 🧾 INFO GENERAL */}
        <p className="font-semibold">
          Pedido #{id_pedido}
        </p>

        <p>
          <strong>Cliente:</strong>{" "}
          {pedido.nombre_cliente && pedido.apellidos_cliente
            ? `${pedido.nombre_cliente} ${pedido.apellidos_cliente}`
            : pedido.nombre_cliente || "N/A"}
        </p>

        <p className="text-gray-700">
          Total: ${pedido.total || "0.00"}
        </p>

        {/* 📍 DIRECCIÓN */}
        <div className="flex items-start gap-2 mt-3">
          <span>📍</span>
          <p className="text-gray-700">
            {pedido.calle || ""} {pedido.numero_exterior || ""},{" "}
            {pedido.colonia || ""}, {pedido.codigo_postal || ""},{" "}
            {pedido.ciudad || ""}, {pedido.estado || ""}
          </p>
        </div>-

      </div>
    )}
  </div>
);
}