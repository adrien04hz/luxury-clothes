/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 * 10 de abril de 2026
 */
import { filterProductos } from "@/client/producto.client";
import Image from "next/image";
import Filtros from "../components/Filtros";
import { getCategorias } from "@/client/categoria.client";
import { getGeneros } from "@/client/genero.client";
import { getColores } from "@/client/color.client";
import { getMarcas } from "@/client/marca.client";


interface Props {
    searchParams: Promise<{
        q?: string;
        categoria?: string;
        marca?: string;
        genero?: string;
        color?: string;
        precioMin?: string;
        precioMax?: string;
        orden?: string;
    }>;
}

export default async function BuscarPage({ searchParams }: Props) {
    const categoriasRes = await getCategorias();
    const categorias = categoriasRes.data;
    const generosRes = await getGeneros();
    const generos = generosRes.data;
    const coloresRes = await getColores();
    const colores = coloresRes.data;
    const marcasRes = await getMarcas();
    const marcas = marcasRes.data;

    const params = await searchParams;

    const productosRes = await filterProductos({
        q: params.q,
        categoria: params.categoria,
        marca: params.marca,
        genero: params.genero,
        color: params.color,
        precioMin: params.precioMin,
        precioMax: params.precioMax,
        orden: params.orden,
    });

    const productos = Array.isArray(productosRes)
        ? productosRes
        : productosRes.data;

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">
                Resultados para: "{params.q}"
            </h1>
            <hr />

            <div className="flex justify-between items-center mt-2 mb-4">
                <p className="text-gray-600">
                    {productos?.length || 0} artículos
                </p>
                <Filtros categorias={categorias} generos={generos} colores={colores} marcas={marcas} />
            </div>

            {
                Array.isArray(productos) && productos.map((producto) => (
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