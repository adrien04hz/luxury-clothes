/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class DetalleListaDeseos {

  //Encontrar los productos de la lista de deseos de un cliente
  static async findByUserId(clientId: number) {
    const query = `
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

    await pool.query(query, [listId, productId]);

  }


  //Encontrar el id del cliente de la lista de deseos
  static async findWishlistIdByClientId(clientId: number) {
    const query = `
      SELECT id
      FROM "ListaDeseos"
      WHERE id_cliente = $1
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows[0];
  }

  //Si el cliente no tiene lista de deseos, crear una nueva
  static async createWishlistForClient(clientId: number) {
    const query = `
      INSERT INTO "ListaDeseos" (id_cliente)
      VALUES ($1)
      RETURNING id
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows[0];
  
  }
}
