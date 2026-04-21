"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ListaPedidosPage() {

  const router = useRouter();

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔹 1. Obtener pedidos (IDs)
        const res = await fetch("/api/logistica/envios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al obtener pedidos");
        }

        const lista = data.data || [];

        // 🔹 2. Obtener estado REAL de cada pedido
        const resultados = await Promise.all(
          lista.map((p: any) =>
            fetch(`/api/pedido/${p.id_pedido}/estado`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then(res => res.json())
          )
        );

        setPedidos(resultados);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Pedidos
      </h1>

      {loading && <p>Cargando pedidos...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && pedidos.length === 0 && (
        <p>No hay pedidos disponibles</p>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido: any, index: number) => {

          // ⚠️ Ajusta según cómo venga tu JSON
          const data = pedido.data || pedido;

          return (
            <div
              key={index}
              onClick={() => router.push(`/logistica/estadopedido/${data.id_pedido || index + 1}`)}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <div className="flex justify-between items-center">

                {/* 📦 ID */}
                <div>
                  <p className="font-semibold">
                    Pedido #{data.id_pedido || index + 1}
                  </p>

                  {/* 🧑 Cliente */}
                  <p className="text-sm text-gray-600">
                    {data.nombre_cliente || "Cliente"}
                  </p>
                </div>

                {/* 🟣 ESTADO */}
                <div className="px-3 py-1 rounded-full text-white text-sm bg-purple-600">
                  {data.estado || "Sin estado"}
                </div>

              </div>

              {/* 📅 Fecha */}
              {data.fecha && (
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(data.fecha).toLocaleString()}
                </p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}