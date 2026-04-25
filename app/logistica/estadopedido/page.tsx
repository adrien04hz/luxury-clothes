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

        // 1. Obtener pedidos (IDs)
        const res = await fetch("/api/logistica/pedido", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
          throw new Error(data.error || "Error al obtener pedidos");
        }

        const lista = data.data || [];

        //2. Obtener estado REAL de cada pedido
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
        {/* Nuevo mapeo de pedidos */}
        {pedidos.map((pedido: any) => {
          return (
            <div
              key={pedido.id}
              onClick={() => router.push(`/logistica/estadopedido/${pedido.id}`)}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <div className="flex justify-between items-center">

                {/* numero de pedido */}
                <div>
                  <p className="font-semibold">
                    Pedido #{pedido.id}
                  </p>

                  {/* Estado de Pedido */}
                  <p className="text-sm text-gray-600">
                    {pedido.estado}
                  </p>
                </div>

                {/* Fecha de Pedido */}
                <div className="px-3 py-1 rounded-full text-white text-sm bg-purple-600">
                  {new Date(pedido.fecha_pedido).toLocaleString()}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}