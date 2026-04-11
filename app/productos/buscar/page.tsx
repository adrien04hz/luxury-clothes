/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 * 10 de abril de 2026
 */
import { filterProductos } from "@/client/producto.client";
import Filtros from "../components/Filtros";
import { getCategorias } from "@/client/categoria.client";
import { getGeneros } from "@/client/genero.client";
import { getColores } from "@/client/color.client";
import { getMarcas } from "@/client/marca.client";
import CatalogoCuerpo from "../components/CatalogoCuerpo";
import BreadCrumb from "../components/BreadCrumb";


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
        <div className="flex flex-col justify-center items-start px-24">
            <BreadCrumb />
            
            <div className="flex justify-between items-center mt-2 mb-4 w-full">
                <Filtros categorias={categorias} generos={generos} colores={colores} marcas={marcas} title={params.q} count={productos.length} />
            </div>

            <CatalogoCuerpo items={productos} />
        </div>
    );
}