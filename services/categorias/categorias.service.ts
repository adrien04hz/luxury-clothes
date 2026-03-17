/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Servicio de categorias
 */

import { CategoriaRepository } from "@/repositories/categoria/categoria.repository";

export class CategoriaService {
    /**
     * Obtener categorías con sus subcategorías
     * @returns Lista de categorías con sus subcategorías
     */
    static async getCategoriasConSubcategorias() {
        return await CategoriaRepository.getCategoriasConSubcategorias();
    }
}