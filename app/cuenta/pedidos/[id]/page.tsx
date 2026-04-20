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
        <div className="p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <button
            onClick={() => router.push("/cuenta/pedidos")}
            className="text-blue-600 hover:underline text-sm"
            >
            ← Volver a pedidos
            </button>

            <h1 className="text-lg font-bold">
            Detalles de pedido #{id}
            </h1>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {detalle.length === 0 && !error && (
            <p>Cargando...</p>
        )}

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 🧾 DETALLE DEL PEDIDO */}
            <div className="sm:col-span-2 bg-white  p-6">

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

            <div className="bg-white p-6 shadow-sm h-fit">
            <SeguimientoPedido historial={historialPedido} />
            </div>

        </div>
        </div>
    );
}