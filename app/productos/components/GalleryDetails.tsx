"use client";
import Image from "next/image";
import { useState } from "react";
import { Producto } from "@/types/producto/Producto";

export default function GalleryDetails({
    data,
} : {
    data: Producto,
}) {
    const [url, setURL] = useState<string | null>(null);

    return (            
        <div className="flex space-x-4 w-fit">
            {/* Imagenes de costado */}
            <div className="flex flex-col justify-start items-center space-y-3">
                {data.imagenes && data.imagenes.map((imgUrl, index) => (
                    <div className="w-17.5 h-17.5 overflow-hidden rounded-[10px] relative border-gray-200 border" key={index}>
                        <Image
                            key={index}
                            src={imgUrl}
                            alt={`${data.nombre} - Imagen ${index + 1}`}
                            fill
                            className="mb-4 object-cover cursor-pointer rounded-[10px] hover:opacity-80"
                            onClick={() => setURL(imgUrl)}
                            onMouseEnter={() => setURL(imgUrl)}
                        />
                    </div>
                ))}
            </div>
            {/* Imagen principal */}
            <div className="w-133.75 h-167.25 relative overflow-hidden">
                <Image
                    src={url ? url.toString() : data.imagenes?.[0] || "/placeholder.png"}
                    alt={data.nombre}
                    fill
                    className="object-cover rounded-[10px] border border-gray-200"
                    loading="eager"
                />
            </div>
        </div>
    );
}