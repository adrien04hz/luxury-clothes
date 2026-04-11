"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Producto } from "@/types/producto/Producto";
import { useParams } from "next/navigation";

export default function ProductoPage() {
    const [producto, setProducto] = useState<Producto | null>(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchProducto() {
            try {
                const res = await fetch(`/api/producto/${id}`);
                const data = await res.json();
                setProducto(data.data);
            } catch (error) {
                console.error("Error fetching producto:", error);
            }
        }

        fetchProducto();
    }, [id]);

    if (!producto) {
        return <div className="h-full w-full flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div>
            
        </div>
    );
}