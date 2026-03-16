/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Repositorio de proveedor bancario
 */
import { pool } from "@/lib/db";

export class ProveedorRepository {

    /**
     * Obtener proveedores bancarios
     * @returns Lista de proveedores bancarios
     */
    async getProveedoresBancarios() {
        const { rows } = await pool.query(
            `
                SELECT
                    id,
                    nombre,
                    url_logo AS url
                FROM "ProveedorBancario"
            `
        );

        return rows;
    }
}