"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ConfirmacionPage() {
  const router = useRouter();
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
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">

        {/* HEADER */}
        <div className="text-center pb-4 mb-4">
          <h2 className="text-xl font-bold tracking-wide">
            COMPROBANTE DE PAGO
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Pedido #{idPedido}
          </p>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleString("es-MX")}
          </p>
        </div>
      
        {/* PRODUCTOS */}
        <div className="space-y-3">
          {comprobante.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center pb-2 text-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.producto}
                </p>
                <p className="text-gray-500 text-xs">
                  Cantidad: {item.cantidad}
                </p>
              </div>
      
              <div className="text-right">
                <p className="text-gray-700">
                ${Number(item.precio_unitario).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                </p>
              </div>
            </div>
          ))}
        </div>
      
        {/* TOTAL */}
        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <p className="text-lg font-semibold">
            Total
          </p>
          <p className="text-xl font-bold text-gray-900">
            ${Number(comprobante[0]?.total).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      
        {/* FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-gray-900 font-medium">
            ✔ Pago confirmado
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Gracias por tu compra
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">

        {/* Volver al inicio */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Ir al inicio
        </button>

        {/* Ver pedidos */}
        <button
          onClick={() => router.push("/cuenta/pedidos")}
          className="w-full border border-black text-black py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Ver mis pedidos
        </button>

      </div>
      
      </div>
      )}
    </div>
  );
}