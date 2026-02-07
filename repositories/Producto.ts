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

    static async productDetails(productId: number){
    const { rows } = await pool.query(
      `
      SELECT
        P.id AS id,
        P.nombre AS nombre,
        P.precio AS precio,
        P.stock AS stock,
        M.nombre AS marca,
        array_agg(I.url) AS imagenes
      FROM "Producto" P
      LEFT JOIN "ImagenProducto" I ON P.id = I.id_producto
      LEFT JOIN "Marca" M ON P.id_marca = M.id
      WHERE P.id = $1
      GROUP BY P.id, P.nombre, P.precio, P.stock, M.nombre;

      `,
      [productId]
    );

    return rows[0];
  }
}
