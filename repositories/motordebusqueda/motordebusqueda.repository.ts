/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 * 12 de marzo de 2026
 */

import { pool } from '@/lib/db';

// tarea de busqueda de articulo
export class BusquedaArticulo {

  static async buscar(palabra: string) {
    const { rows } = await pool.query(
      `
      SELECT DISTINCT ON (p.id)
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        c.nombre AS color,
        g.nombre AS genero,
        s.nombre AS subcategoria,
        m.nombre AS marca,
        i.url AS imagen_url
      FROM "Producto" p
      INNER JOIN "Color" c ON p.id_color = c.id
      INNER JOIN "Genero" g ON p.id_genero = g.id
      INNER JOIN "Subcategoria" s ON p.id_subcategoria = s.id
      INNER JOIN "Marca" m ON p.id_marca = m.id
      LEFT JOIN "ImagenProducto" i ON p.id = i.id_producto
      WHERE
      (
        p.nombre ILIKE $1
        OR p.descripcion ILIKE $1
        OR m.nombre ILIKE $1
      )
      AND p.activo = TRUE
      ORDER BY p.id
      `,
      [`%${palabra}%`]
    );

    return rows;
  }
}

// tarea de filtro de articulo
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
      condiciones.push(`
        (
          P.nombre ILIKE $${i}
          OR P.descripcion ILIKE $${i}
          OR M.nombre ILIKE $${i}
          OR S.nombre ILIKE $${i}
        )
      `);
      valores.push(`%${palabra}%`);
      i++;
    }

    if (idCategoria) {
      condiciones.push(`C.id = $${i}`);
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
      condiciones.push(`P.activo = TRUE`);
    }

    if (conStock) {
      condiciones.push(`
        EXISTS (
          SELECT 1
          FROM "StockPorTallas" ST
          WHERE ST.id_producto = P.id
          AND ST.stock > 0
        )
      `);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(" AND ")}`
      : "";

    const query = `
      SELECT
        P.id,
        P.nombre,
        P.descripcion,
        P.precio,
        M.nombre AS marca,
        S.nombre AS subcategoria,
        C.nombre AS categoria,
        (
          SELECT I.url
          FROM "ImagenProducto" I
          WHERE I.id_producto = P.id
          ORDER BY I.id
          LIMIT 1
        ) AS imagen_url
      FROM "Producto" P
      INNER JOIN "Marca" M ON P.id_marca = M.id
      INNER JOIN "Subcategoria" S ON P.id_subcategoria = S.id
      INNER JOIN "Categoria" C ON S.id_categoria = C.id
      ${where}
      ORDER BY P.id DESC
      LIMIT 50
    `;

    const { rows } = await pool.query(query, valores);
    return rows;
  }
}
