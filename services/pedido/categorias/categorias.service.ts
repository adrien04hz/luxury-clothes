/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Servicio de categorias
 */

import { CategoriaRepository } from "@/repositories/producto/categoria/categoria.repository";

export class CategoriaService {
    /**
     * Obtener categorías con sus subcategorías
     * @returns Lista de categorías con sus subcategorías
     */
    static async getCategoriasConSubcategorias(id_genero: number) {
        return await CategoriaRepository.getCategoriasConSubcategorias(id_genero);
    }

    /**
     * Obtener todas las categorias con subcategorias
     * disponibles en la base de datos
     * @returns Lista de categorías con sus subcategorías
     */
    static async getTodasLasCategorias() {
        return await CategoriaRepository.getTodasLasCategorias();
    }

    /**
     * Obtener categorias default
     * @returns Lista de categorias con su id y nombre
     */
    static async getCategoriasDefault() {
        return await CategoriaRepository.getCategoriasDefault();
    }
}