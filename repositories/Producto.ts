/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class Producto {

  static async findAll() {
    const { rows } = await pool.query(
      `
      SELECT DISTINCT ON (P.id)
        P.id,
        P.nombre,
        P.precio,
        P.stock,
        M.nombre AS marca,
        I.url AS imagen_url
      FROM "Producto" P
      INNER JOIN "Marca" M ON P.id_marca = M.id
      INNER JOIN "ImagenProducto" I ON P.id = I.id_producto
      ORDER BY P.id
      `
    );

    return rows;
  }
}
