/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { ProductosResponse } from "@/types/producto/Producto";

/**
 * Funcion que retorna catalogo segun sea necesario
 */
export const getCatalogo = ({
        id_genero,
        id_categoria,
        id_subcategoria,
        id_marca
    }: {
        id_genero?: number;
        id_categoria?: number;
        id_subcategoria?: number;
        id_marca?: number;
    }) : Promise<ProductosResponse> => {

    const conditions: string[] = [];

    if (id_genero) {
      conditions.push(`id_genero=${id_genero}`);
    }

    if (id_categoria) {
      conditions.push(`id_categoria=${id_categoria}`);
    }

    if (id_subcategoria) {
      conditions.push(`id_subcategoria=${id_subcategoria}`);
    }

    if (id_marca) {
      conditions.push(`id_marca=${id_marca}`);
    }

    const params = conditions.length
    ? `?${conditions.join('&')}`
    : '';

    return apiFetch(`/catalogo${params}`);
}


/**
 * Funcion que retorna detalles de un producto segun su ID
 * @param id - ID del producto
 * @returns Detalles del producto
 */
export const getProducto = (id: number) : Promise<ProductosResponse> => {
    return apiFetch(`/api/producto/${id}`);
}

/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 09 de marzo de 2026
 */
export const searchProductos = (q: string) : Promise<ProductosResponse>=> {
  return apiFetch(`/motordebusqueda/busqueda?q=${encodeURIComponent(q)}`)
}