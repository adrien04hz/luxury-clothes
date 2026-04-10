"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmacionPage() {
  const searchParams = useSearchParams();
  const idPedido = searchParams.get("id");

  const [comprobante, setComprobante] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idPedido) return;

    const fetchComprobante = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/pedido/${idPedido}/comprobante`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setComprobante(data);

      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchComprobante();
  }, [idPedido]);

  if (!idPedido) {
    return <p className="p-5">Cargando ID del pedido...</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Confirmación de compra</h1>

      {error && <p className="text-red-500">{error}</p>}

      {!comprobante && !error && (
        <p>Cargando comprobante...</p>
      )}

      {comprobante && (
        <div className="border p-4 rounded shadow">
          <p><strong>Pedido:</strong> #{idPedido}</p>

          <hr className="my-3" />

          {comprobante.map((item: any, index: number) => (
            <div key={index} className="mb-2">
              <p><strong>Producto:</strong> {item.producto}</p>
              <p><strong>Cantidad:</strong> {item.cantidad}</p>
              <p><strong>Precio:</strong> ${item.precio_unitario}</p>
            </div>
          ))}

          <hr className="my-3" />

          <p><strong>Total:</strong> ${comprobante[0]?.total}</p>
        </div>
      )}
    </div>
  );
}