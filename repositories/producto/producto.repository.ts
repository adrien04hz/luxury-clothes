/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class Producto {

  /**
   * Retrieves all products, optionally filtered by gender, category, subcategory, or brand.
   * 
   * @param param0 - Object containing optional filter parameters:
   *   - id_genero?: number - Filter by gender ID.
   *   - id_categoria?: number - Filter by category ID.
   *   - id_subcategoria?: number - Filter by subcategory ID.
   *   - id_marca?: number - Filter by brand ID.
   * @returns Promise resolving to an array of products with basic details.
   */
  static async getAllProducts( {
    id_genero,
    id_categoria,
    id_subcategoria,
    id_marca
  }: {
    id_genero?: number;
    id_categoria?: number;
    id_subcategoria?: number;
    id_marca?: number;
  }) {

    const conditions: string[] = [];
    const values: any[] = [];

    if (id_genero) {
      values.push(id_genero);
      conditions.push(`P.id_genero = $${values.length}`);
    }

    if (id_categoria) {
      values.push(id_categoria);
      conditions.push(`S.id_categoria = $${values.length}`);
    }

    if (id_subcategoria) {
      values.push(id_subcategoria);
      conditions.push(`P.id_subcategoria = $${values.length}`);
    }

    if (id_marca) {
      values.push(id_marca);
      conditions.push(`P.id_marca = $${values.length}`);
    }

    const whereClause = conditions.length
      ? `AND ${conditions.join(' AND ')}`
      : '';

    const query = `
      SELECT DISTINCT ON (P.id)
        P.id,
        P.nombre,
        P.precio,
        M.nombre AS marca,
        I.url AS imagen_url
      FROM "Producto" P
      INNER JOIN "Marca" M ON P.id_marca = M.id
      INNER JOIN "ImagenProducto" I ON P.id = I.id_producto
      INNER JOIN "Subcategoria" S ON P.id_subcategoria = S.id
      WHERE P.activo = true 
      ${whereClause}
      ORDER BY P.id
      `
    const { rows } = await pool.query(query, values);

    return rows;
  }


  /**
   * Función que obtiene detalles de un producto.
   * @param productId - ID del producto para el cual se desean obtener los detalles.
   * @returns JSON con los detalles del producto, incluyendo nombre, descripción, precio, color, marca, imágenes y stock por talla.
   */
  static async productDetails(productId: number){
    const { rows } = await pool.query(
      `
      SELECT
        P.id,
        P.nombre,
        P.descripcion,
        P.precio,
        C.nombre AS color,
        M.nombre AS marca,

        -- Imagenes
        COALESCE(
          (
            SELECT array_agg(I.url)
            FROM "ImagenProducto" I
            WHERE I.id_producto = P.id
          ),
          '{}'
        ) AS imagenes,

        -- Stock por talla
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', T.id,
                'talla', T.nombre,
                'stock', S.stock
              )
            )
            FROM "StockPorTalla" S
            JOIN "Talla" T ON S.id_talla = T.id
            WHERE S.id_producto = P.id
          ),
          '[]'
        ) AS stock_por_talla

      FROM "Producto" P
      LEFT JOIN "Marca" M ON P.id_marca = M.id
      LEFT JOIN "Color" C ON P.id_color = C.id
      WHERE P.id = $1;
      `,
      [productId]
    );

    return rows[0];
  }
}
