// # detalle de pedido especifico
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

    return (
        <div className="p-5">
        <h1 className="text-2xl mb-4">Detalle del Pedido #{id}</h1>

        {error && <p className="text-red-500">{error}</p>}

        {detalle.length === 0 && !error && (
            <p>Cargando...</p>
        )}

        {detalle.map((item, index) => (
            <div key={index} className="border p-3 mb-2">
            <p><strong>Producto:</strong> {item.producto}</p>
            <p><strong>Talla:</strong> {item.talla}</p>
            <p><strong>Cantidad:</strong> {item.cantidad}</p>
            <p><strong>Precio:</strong> ${item.precio_unitario}</p>
            </div>
        ))}
        </div>
    );
}