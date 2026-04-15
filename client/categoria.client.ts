/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { CategoriaPorGenero, Categorias } from "@/types/producto/Categoria";

/**
 * Funcion que retorna listado de categorias
 * con sus correspondientes subcategorias
 */
export const getCategorias = (id_genero: number) : Promise<CategoriaPorGenero> => {
    return apiFetch(`/categorias?id_genero=${id_genero}`);
}

/**
 * Funcion que retorna listado de todas las categorias disponibles
 */
export const getTodasLasCategorias = () : Promise<CategoriaPorGenero> => {
    return apiFetch(`/categorias/all`);
}

/**
 * Funcion que retorna listado de categorias por genero, pero solo con su id y nombre
 */
export const getCategoriasDefault = () : Promise<Categorias> => {
    return apiFetch(`/categorias/default`);
}