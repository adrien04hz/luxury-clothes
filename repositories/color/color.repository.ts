/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class ColorRepository {
    /**
     * Obtiene todos los colores de la base de datos.
     * @return Colores obtenidos de la base de datos.
     */

    static async getColors() {
        const { rows } = await pool.query('SELECT * FROM "Color"');
        return rows;
    }
}