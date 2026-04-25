//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 10/04/2026 */
//**********/

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EstadoPedidoPage() {

  const { id } = useParams();
  const router = useRouter();

  const [pedido, setPedido] = useState<any>(null);
  const [error, setError] = useState("");

  const [nuevoEstado, setNuevoEstado] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (id) fetchEstado();
  }, [id]);


  const fetchEstado = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/pedido/${id}/estado`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setPedido(data);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const actualizarEstado = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID") || localStorage.getItem("userId");
  
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
          idPedido: Number(id),
          idNuevoEstado: Number(nuevoEstado),
          idUsuarioLogistica: Number(userID),
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error);
      }
  
      setMensaje("Estado actualizado correctamente");
  
      /**
       * @author Adrien H. S. - 2024-06-21
       * Cambié esta parte eliminando el reload window.
       */
      await fetchEstado();
  
    } catch (err: any) {
      setMensaje(err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* BOTÓN REGRESAR */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-semibold mb-4">
        Estado del Pedido #{id}
      </h1>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!pedido && !error && (
        <p>Cargando...</p>
      )}

      {pedido && (
        <div className="bg-white shadow rounded-xl p-5 space-y-3">

          <p>
            <strong>Cliente:</strong> {pedido.nombre_cliente}
          </p>

          <p>
            <strong>Estado:</strong>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {pedido.estado}
            </span>
          </p>

          <p>
            <strong>Descripción:</strong> {pedido.estado_descripcion}
          </p>

          <p>
            <strong>Total:</strong> ${pedido.total}
          </p>

          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(pedido.fecha_pedido).toLocaleString()}
          </p>

        </div>
      )}

      {/* 🔄 CAMBIAR ESTADO */}
      <div className="mt-4">
        <label className="block mb-1 font-medium">
          Cambiar estado
        </label>

        <select
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Selecciona estado</option>
          <option value="1">Pendiente</option>
          <option value="2">Pagado</option>
          <option value="3">En preparación</option>
          <option value="4">Listo para envío</option>
          <option value="5">Completado</option>
          <option value="6">Cancelado</option>
        </select>

        <button
          onClick={actualizarEstado}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar estado
        </button>

        {mensaje && (
          <p className="text-green-600 mt-2">{mensaje}</p>
        )}
      </div>
    </div>
  );
}