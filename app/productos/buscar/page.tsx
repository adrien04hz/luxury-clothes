import { searchProductos } from "@/client/producto.client";
import Image from "next/image";

interface Props {
    searchParams: Promise<{
        q?: string;
    }>;
}

export default async function BuscarPage({ searchParams }: Props) {

    const params = await searchParams;
    const query = params.q || "";

    const response = await searchProductos(query);
    const productos = response.data;
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">
                Resultados para: "{query}"
            </h1>

                {
                    productos?.map((producto) => (
                        <div key={producto.id}>
                            <h2>{producto.nombre}</h2>
                            {/* <p>{producto.descripcion}</p> */}
                            <Image src={producto.imagen_url || "/default-image.jpg"} alt={producto.nombre} width={200} height={200} />
                        </div>
                    ))
                }
        </div>
    );
}