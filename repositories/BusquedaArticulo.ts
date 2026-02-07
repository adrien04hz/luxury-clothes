/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class BusquedaArticulo {

  static async buscar(palabra: string) {
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
      WHERE
        P.nombre ILIKE $1
        OR M.nombre ILIKE $1
      ORDER BY P.id
      `,
      [`%${palabra}%`]
    );

    return rows;
  }
}
