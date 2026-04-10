"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const realizarCompra = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/pedido/procesar_compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_metodo_pago: 1,
          id_direccion: 1,
          notas: "Compra desde web"
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Respuesta no válida del servidor");
      }

      if (!res.ok) {
        throw new Error(data.error || "Error al crear pedido");
      }

      console.log("Respuesta del servidor:", data);

      const idPedido = data.id_pedido || data.pedido?.id;

      if (!idPedido) {
        throw new Error("No se recibió el ID del pedido");
      }

      router.push(`/checkout/confirmacion?id=${idPedido}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Checkout</h1>

      <div className="border p-4 rounded shadow">
        <p><strong>Producto:</strong> Producto en carrito</p>
        <p><strong>Cantidad:</strong> Según carrito</p>
        <p><strong>Total:</strong> Calculado automáticamente</p>

        <button
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          onClick={realizarCompra}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Confirmar compra"}
        </button>

        {error && (
          <p className="text-red-500 mt-3">{error}</p>
        )}
      </div>
    </div>
  );
}