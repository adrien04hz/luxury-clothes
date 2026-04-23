"use client";

//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 10/04/2026 */
//**********/

// # Historial de pedidos

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistorialPedido } from "@/types/pedido/historial";
import SidebarCuenta from "../../components/SidebarCuenta";

export default function HistorialPedidosPage() {
  const router = useRouter();

  const [historial, setHistorial] = useState<HistorialPedido[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false); 
      }
    };
  
    fetchHistorial();
  }, [router]);

  const pedidosAgrupados = Object.values(
    historial.reduce((acc: any, item) => {
      if (!acc[item.id_pedido]) {
        acc[item.id_pedido] = {
          ...item,
          productos: [],
        };
      }

      acc[item.id_pedido].productos.push({
        producto: item.producto,
        cantidad: item.cantidad,
      });

      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <h1 className="text-3xl font-semibold text-center">Mis pedidos</h1>
        <p className="text-center text-gray-600 mt-1 text-lg">
            Bienvenido <span className="font-medium text-gray-900"></span>
        </p>
      </div>

      <div className="flex flex-1 w-full max-w-full px-50">
        <SidebarCuenta />

        <div className="flex-1 pl-40 max-w-full bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-10">

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {loading && (
              <p className="text-gray-600">Cargando pedidos...</p>
            )}

            {!loading && historial.length === 0 && !error && (
              <p className="text-gray-600">No tienes pedidos aún</p>
            )}

            <div className="space-y-4 mt-6 w-full">
              {pedidosAgrupados
              .slice()
              .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .map((pedido: any, index: number) => (
                <div
                  key={index}
                  onClick={() => router.push(`/cuenta/pedidos/${pedido.id_pedido}`)}
                  className="w-full bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Pedido #{pedido.id_pedido}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(pedido.fecha).toLocaleString("es-MX", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* ESTADO */}
                    <span className={`
                      px-3 py-1 text-sm rounded-full text-white
                      ${pedido.estado === "Pagado" ? "bg-green-500" : ""}
                      ${pedido.estado === "Pendiente" ? "bg-yellow-500" : ""}
                      ${pedido.estado === "Enviado" ? "bg-blue-500" : ""}
                    `}>
                      {pedido.estado}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold">${pedido.total}</p>
                  </div>

                  <hr className="my-4" />

                  {/* PRODUCTOS */}
                  <div className="space-y-3">
                    {pedido.productos.map((prod: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b pb-2 last:border-none"
                      >
                        <p className="text-gray-800">
                          {prod.producto}
                        </p>
                        <span className="text-sm text-gray-500">
                          x{prod.cantidad}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}