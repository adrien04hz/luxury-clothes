"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Producto } from "@/types/producto/Producto";
import { useParams } from "next/navigation";

export default function ProductoPage() {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [url, setURL] = useState<String | null>(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchProducto() {
            try {
                const res = await fetch(`/api/producto/${id}`);
                const data = await res.json();
                setProducto(data.data);
                setURL(data.data.imagenes[0]);
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
        <div className="p-24 w-full h-full flex gap-8 justify-center">
            {/* Div para la galeria de imagenes */}
            <div className="flex space-x-4 w-fit">
                {/* Imagenes de costado */}
                <div className="flex flex-col justify-start items-center space-y-3">
                    {producto.imagenes && producto.imagenes.map((imgUrl, index) => (
                        <div className="w-17.5 h-17.5 overflow-hidden rounded-[10px]" key={index}>
                            <Image
                                key={index}
                                src={imgUrl}
                                alt={`${producto.nombre} - Imagen ${index + 1}`}
                                width={70}
                                height={70}
                                className="mb-4 cursor-pointer border rounded hover:opacity-80"
                                onClick={() => setURL(imgUrl)}
                                onMouseEnter={() => setURL(imgUrl)}
                                objectFit="cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
                {/* Imagen principal */}
                <div className="w-133.75 h-167.25">
                    <Image
                        src={url ? url.toString() : producto.imagen_url || "/placeholder.png"}
                        alt={producto.nombre}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full rounded-[10px]"
                        loading="eager"
                    />
                </div>
            </div>

            {/* Div para la informacion del producto */}
            <div>
                <div className="font-semibold text-2xl w-100 h-fit mt-6">
                    <p>{producto.nombre}</p>
                </div>
                <div className="w-100 h-fit font-regular text-[14px] opacity-50 mt-2">
                    <p>{producto.descripcion}</p>
                </div>
                <div className="font-semibold text-[16px] mt-6">
                    <p>${Number(producto.precio).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4 text-[16px] mt-8">
                    <p className="font-bold">Color: </p>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: getColor(producto.color || "lightgray") }}></div>
                        <p>{producto.color}</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                    <p className={"font-semibold"}>Selecciona tu talla:</p>
                    <div className="grid grid-cols-3 gap-2 w-fit">
                        { 
                            producto.stock_por_talla && producto.stock_por_talla.map(
                                (item, index) => <Talla key={index} talla={item.talla} stock={item.stock} />
                            )
                        }
                    </div>
                </div>
                <div className="mt-12 w-full">
                    <button className="bg-black text-white py-2 px-4 rounded-[28px] w-full h-16 hover:opacity-60">
                        Agregar al carrito
                    </button>
                </div>

                <div className="mt-6 w-full">
                    <button className="text-black bg-white py-2 px-4 rounded-[28px] w-full h-16 border border-[#E6E6E6] hover:border-black">
                        Añadir a lista de deseos
                    </button>
                </div>
            </div>
        </div>
    );
}

function getColor(nombre: string) {
    switch (nombre.toLowerCase()) {
        case "negro":
            return "#111111";
        case "blanco":
            return "#F2F1ED";
        case "rojo":
            return "#7A1E1E";
        case "azul":
            return "#0F1A2B";
        case "verde":
            return "#0F3D2E";
        case "amarillo":
            return "#C6A75E";
        case "gris":
            return "#4A4F55";
        case "naranja":
            return "#A65A3A";
        case "rosa":
            return "#B76E79";
        case "morado":
            return "#4B2E3F";
        case "café":
            return "#3B241C";
        case "cafe":
            return "#3B241C";
        case "beige":
            return "#C8B69C";
        default:
            return "lightgray";
    }
}

// Componente para tallas
function Talla({
    talla,
    stock,
} : {
    talla: string;
    stock: number;
}) {
    return (
        <div className={`w-30 h-12 border border-[#E6E6E6] rounded-md flex items-center justify-center ${stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[#111111]"}`}>
            {talla} ({stock})
        </div>
    );
}