// # Historial de pedidos
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistorialPedido } from "@/types/pedido/historial";

export default function HistorialPedidosPage() {
  const router = useRouter();

  const [historial, setHistorial] = useState<HistorialPedido[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const token = localStorage.getItem("token");
        const idUsuario = localStorage.getItem("userID");
  
        if (!token || !idUsuario) {
          router.push("/auth/login");
          return;
        }
  
        const res = await fetch(`/api/pedido/cliente/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error);
        }
  
        setHistorial(data);
  
      } catch (err: any) {
        setError(err.message);
        router.push("/auth/login");
      }
    };
  
    fetchHistorial();
  }, []);

  return (
    <div className="p-5">
      <button onClick={() => router.push("/cuenta/")} className="mb-4 text-blue-600 hover:underline">
        Volver a cuenta
      </button>  
      <h1 className="text-2xl mb-4">Mis pedidos</h1>

      {error && <p className="text-red-500">{error}</p>}

      {historial.length === 0 && !error && (
        <p>No tienes pedidos aún</p>
      )}

      {historial.map((pedido, index) => (
        <div
          key={index}
          className="border p-4 mb-3 cursor-pointer"
          onClick={() => router.push(`/cuenta/pedidos/${pedido.id_pedido}`)}
        >
          <p><strong>Pedido:</strong> #{pedido.id_pedido}</p>
          <p><strong>Fecha:</strong> {pedido.fecha}</p>
          <p><strong>Total:</strong> ${pedido.total}</p>
          <p><strong>Estado:</strong> {pedido.estado}</p>

          <hr className="my-2" />

          <p><strong>Producto:</strong> {pedido.producto}</p>
          <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
        </div>
      ))}
    </div>
  );
}