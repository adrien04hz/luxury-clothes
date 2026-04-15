/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { CategoriaPorGenero } from "@/types/producto/Categoria";

/**
 * Funcion que retorna listado de categorias
 * con sus correspondientes subcategorias
 */
export const getCategorias = (id_genero: number) : Promise<CategoriaPorGenero> => {
    return apiFetch(`/categorias?id_genero=${id_genero}`);
}