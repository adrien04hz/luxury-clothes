/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { DetailResponse, ProductosResponse } from "@/types/producto/Producto";

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
export const getProducto = (id: number) : Promise<DetailResponse> => {
    return apiFetch(`/producto/${id}`);
}

/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 * 10 de abril de 2026
 */
export const filterProductos = ({
  q,
  categoria,
  marca,
  genero,
  color,
  precioMin,
  precioMax,
  orden
}: {
  q?: string;
  categoria?: string;
  marca?: string;
  genero?: string;
  color?: string;
  precioMin?: string;
  precioMax?: string;
  orden?: string;
}) => {

  const params = new URLSearchParams();

  if (q) params.append("q", q);
  if (categoria) params.append("categoria", categoria);
  if (marca) params.append("marca", marca);
  if (genero) params.append("genero", genero);
  if (color) params.append("color", color); 
  if (precioMin) params.append("precioMin", precioMin);
  if (precioMax) params.append("precioMax", precioMax);
  if (orden) params.append("orden", orden); 

  return apiFetch(`/motordebusqueda/filtro?${params.toString()}`);
};