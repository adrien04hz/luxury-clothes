//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 10/04/2026 */
//**********/

// # detalle de pedido especifico
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeguimientoPedido from "../components/SeguimientoPedido";
import { X } from "lucide-react";

export default function DetallePedidoPage() {
    const { id } = useParams();
    const router = useRouter();

    const [detalle, setDetalle] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetalle = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/pedido/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            const data = await res.json();

            if (!res.ok) {
            throw new Error(data.error);
            }

            setDetalle(data);

        } catch (err: any) {
            setError(err.message);  

            // si no está logueado o token inválido
            router.push("/auth/login");
        }
        };

        if (id) fetchDetalle();
    }, [id]);

    const [historialPedido, setHistorialPedido] = useState<any[]>([]);

    //funcion para ver historial del pedido
    useEffect (() => {
        const getHistorial = async () => {
            try{
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/logistica/historial_estados/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });

                const data = await res.json();

                if (!res.ok) {
                throw new Error(data.error);
                }

                setHistorialPedido(data.data);
        }catch (err: any){
            setError(err.message);
        }
    };

        if (id) getHistorial();
    }, [id]);

    console.log("Historial:", historialPedido);
    console.log("Detalle:", detalle);



    return (
        <div className="p-6     max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-bold">
            Detalles de pedido #{id}
            </h1>

            <button
            onClick={() => router.push("/cuenta/pedidos")}
            className="text-gray-900  rounded-full hover:bg-gray-100  hover:text-gray-600 transition text-sm"
            >
              <X size={24} />
            </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {detalle.length === 0 && !error && (
            <p>Cargando...</p>
        )}

        {/* GRID PRINCIPAL */}
        <div className="flex  gap-6">

            {/* DETALLE DEL PEDIDO */}
            <div className="w-1/3 sm:col-span-2 bg-white  p-6">

            <h2 className="text-2xl font-bold mb-4">
                Productos del pedido
            </h2>

            <div className="space-y-4">
                {detalle.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center border-b pb-3"
                >
                    <div>
                    <p className="font-semibold">{item.producto}</p>
                    <p className="text-sm text-gray-500">
                        Talla: {item.talla}
                    </p>
                    <p className="text-sm text-gray-500">
                        Cantidad: {item.cantidad}
                    </p>
                    </div>

                    <div className="text-right">
                    <p className="font-bold">
                        ${item.precio_unitario}
                    </p>
                    </div>
                </div>
                ))}
            </div>

            {/* TOTAL */}
            <div className="mt-6 flex justify-end">
                <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">
                    $
                    {detalle.reduce(
                    (acc, item) =>
                        acc + item.precio_unitario * item.cantidad,
                    0
                    )}
                </p>
                </div>
            </div>
            </div>

            <div className="w-2/3 bg-white p-6 shadow-sm h-fit">
            <SeguimientoPedido historial={historialPedido} />
            </div>

        </div>
        </div>
    );
}