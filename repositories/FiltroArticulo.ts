/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 */
import { pool } from '@/lib/db';

export class FiltroArticulo {

  static async filtrar(
    palabra: string | null,
    idCategoria: number | null,
    idMarca: number | null,
    precioMin: number | null,
    precioMax: number | null,
    soloActivos: boolean,
    conStock: boolean
  ) {

    const condiciones: string[] = [];
    const valores: any[] = [];
    let i = 1;

    if (palabra) {
      condiciones.push(`(P.nombre ILIKE $${i} OR M.nombre ILIKE $${i})`);
      valores.push(`%${palabra}%`);
      i++;
    }

    if (idCategoria) {
      condiciones.push(`CP.id_categoria = $${i}`);
      valores.push(idCategoria);
      i++;
    }

    if (idMarca) {
      condiciones.push(`P.id_marca = $${i}`);
      valores.push(idMarca);
      i++;
    }

    if (precioMin !== null) {
      condiciones.push(`P.precio >= $${i}`);
      valores.push(precioMin);
      i++;
    }

    if (precioMax !== null) {
      condiciones.push(`P.precio <= $${i}`);
      valores.push(precioMax);
      i++;
    }

    if (soloActivos) {
      condiciones.push(`P.activo = true`);
    }

    if (conStock) {
      condiciones.push(`P.stock > 0`);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(' AND ')}`
      : '';

    const query = `
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
      LEFT JOIN "CategoriaProducto" CP ON CP.id_producto = P.id
      ${where}
      ORDER BY P.id
    `;

    const { rows } = await pool.query(query, valores);
    return rows;
  }
}
