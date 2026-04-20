/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class DetalleListaDeseos {

  //Encontrar los productos de la lista de deseos de un cliente
  static async findByUserId(clientId: number) {
   /*  const query = `
      SELECT 
        p.id,
        p.nombre,
        p.precio,
        p.stock,
        array_agg(i.url) AS imagenes
      FROM "ListaDeseos" ld
      JOIN "DetalleDeseos" dd ON ld.id = dd.id_lista_deseos
      JOIN "Producto" p ON dd.id_producto = p.id
      LEFT JOIN "ImagenProducto" i ON p.id = i.id_producto
      WHERE ld.id_cliente = $1
      GROUP BY p.id, p.nombre, p.precio, p.stock
      ORDER BY p.id
    `; */


     const query = `
      SELECT 
        p.id,
        p.nombre,
        p.precio,
        m.nombre AS marca,
        array_remove(array_agg(i.url), NULL) AS imagenes
      FROM "ListaDeseos" ld
      JOIN "DetalleDeseos" dd ON ld.id = dd.id_lista_deseos
      JOIN "Producto" p ON dd.id_producto = p.id
      JOIN "Marca" m ON p.id_marca = m.id
      LEFT JOIN "ImagenProducto" i ON p.id = i.id_producto
      WHERE ld.id_usuario = $1
      GROUP BY p.id, m.nombre, p.nombre, p.precio, m.nombre
      ORDER BY p.id
    `;

    const { rows } = await pool.query(query, [clientId]);
    return rows;
  }

  //Agregar un producto a la lista de deseos de un cliente
  static async addProductToWishlist(listId: number, productId: number) {
    const query = `
      INSERT INTO "DetalleDeseos" (id_lista_deseos, id_producto)
      VALUES ($1, $2)
    `;
    await pool.query(query, [listId, productId]);

  }
  //Eliminar un producto de la lista de deseos de un cliente
  static async deleteProductToWishList(listId: number, productId: number){
    const query = `
      DELETE FROM "DetalleDeseos"
      WHERE id_lista_deseos = $1
      AND  id_producto = $2
    `;

    const result = await pool.query(query, [listId, productId]);
    return result.rowCount ?? 0;
  }


  //Encontrar el id del cliente de la lista de deseos
  static async findWishlistIdByClientId(clientId: number) {
    const query = `
      SELECT id
      FROM "ListaDeseos"
      WHERE id_usuario = $1
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows[0]?.id;
  }

  //Si el cliente no tiene lista de deseos, crear una nueva
  static async createWishlistForClient(clientId: number) {
    const query = `
      INSERT INTO "ListaDeseos" (id_usuario)
      VALUES ($1)
      RETURNING id
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows[0].id;
  
  }

  static async productExists(productId: number): Promise<boolean> {
  const query = `
    SELECT 1
    FROM "Producto"
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [productId]);

  return rows.length > 0;
}

  /**
   * Función para verificar si un producto ya está en la lista de deseos de un cliente
   * @author Adrien Hernández Sánchez
   * @param id_producto - El ID del producto a verificar
   * @param id_usuario - El ID del usuario para el cual se verifica la lista de deseos
   * @returns {Promise<boolean>} - Devuelve true si el producto ya está en la lista de deseos, false en caso contrario
   */
  static async isProductInWishlist(productId: number, userId: number): Promise<boolean> {
    const query = `
     SELECT EXISTS (
        SELECT 1
        FROM "ListaDeseos" L
        INNER JOIN "DetalleDeseos" D ON D.id_lista_deseos = L.id
        WHERE L.id_usuario = $1
        AND D.id_producto = $2
      ) AS exists;
    `;
    const { rows } = await pool.query(query, [userId, productId]);
    return rows[0].exists;
  }
}
