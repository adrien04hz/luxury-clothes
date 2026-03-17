/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Repositorio de categorias
 */
import { pool } from "@/lib/db";

export class CategoriaRepository {
    /**
     * Obtener categorías con sus subcategorías
     * @returns Lista de categorías con sus subcategorías
     */

    static async getCategoriasConSubcategorias() {
        const { rows } = await pool.query(
            `
                SELECT
                    c.id AS id,
                    c.nombre AS name,

                    COALESCE(
                    (
                        SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'nombre', s.nombre
                        )
                        )
                        FROM "Subcategoria" s
                        WHERE s.id_categoria = c.id
                    ),
                    '[]'
                    ) AS subcategories

                FROM "Categoria" c;
            `
        );
        return rows;
    }
}