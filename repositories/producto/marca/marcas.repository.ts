/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Repositorio de marcas
 */

import { pool } from "@/lib/db";

export class Marca {
    /**
     * Funcion para obtener todas las marcas
     * @returns Lista de marcas
    */
    static async obtenerMarcas() {
        const { rows } = await pool.query(
            `
            SELECT id, nombre, imagen_url
            FROM "Marca"
            WHERE activo = TRUE
            ORDER BY id
            `
        );
        return rows;
    }
}