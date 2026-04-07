/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class GeneroRepository {

    /**
     * Recuperar los generos de la base de datos
     * @return Lista de generos
     */
    static async getGeneros() {
        const { rows } = await pool.query(
            `
                SELECT *
                FROM "Genero"
            `
        );

        return rows;
    }
}