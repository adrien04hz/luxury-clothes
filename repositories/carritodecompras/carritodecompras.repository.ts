/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { pool } from '@/lib/db';

export class Carrito {
  
  /**
   * Función para agregar un producto al carrito de compras. 
   * Si el producto ya existe en el carrito, se actualiza la cantidad.
   * @param id_producto - ID del producto a agregar
   * @param id_usuario - ID del usuario que agrega el producto
   * @param id_talla - ID de la talla del producto
   * @param cantidad - Cantidad del producto a agregar
   * @return void
   */
  static async addProduct({
    id_producto,
    id_usuario,
    id_talla,
    cantidad
  } : {
    id_producto: number;
    id_usuario: number;
    id_talla: number;
    cantidad: number;
  }) {
    await pool.query(
      `
      INSERT INTO "CarritoCompras" (id_usuario, id_producto, id_talla, cantidad)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id_usuario, id_producto, id_talla)
      DO UPDATE 
      SET cantidad = "CarritoCompras".cantidad + EXCLUDED.cantidad
      `,
      [id_usuario, id_producto, id_talla, cantidad]
    );
  }

  
  /**
   * Función para obtener el carrito de compras de un cliente por su ID.
   * @param customerId - ID del cliente para obtener su carrito de compras
   * @returns Lista de productos en el carrito de compras del cliente, incluyendo nombre, precio, talla, cantidad e imagen
   */
  static async getCartByCustomerId(customerId: number) {
    const { rows } = await pool.query(
      `
      SELECT DISTINCT ON (P.id) 
        P.id as id_producto, 
        P.nombre as nombre, 
        P.precio as precio,
        T.nombre as talla,
        C.cantidad as cantidad, 
        I.url as imagen
      FROM "CarritoCompras" C 
      INNER JOIN "Producto" P ON C.id_producto = P.id
      INNER JOIN "Talla" T ON C.id_talla = T.id
      INNER JOIN "ImagenProducto" I ON P.id = I.id_producto
      WHERE C.id_usuario = $1
      `,
      [customerId]
    );

    return rows;
  }

  /**
   * Función para eliminar un producto del carrito de compras de un cliente.
   * @param id_usuario - ID del cliente del cual se desea eliminar el producto
   * @param id_producto - ID del producto que se desea eliminar del carrito de compras
   */
  static async removeProduct(
    {
      id_usuario,
      id_producto,
      id_talla
    } : {
      id_usuario: number;
      id_producto: number;
      id_talla: number;
    }
  ) {
    const result = await pool.query(
      `
        DELETE FROM "CarritoCompras"
        WHERE id_usuario = $1 AND id_producto = $2 AND id_talla = $3
      `,
      [id_usuario, id_producto, id_talla]
    );

    return !!result && typeof result.rowCount === 'number' && result.rowCount > 0;
  }

  // Actualizar la cantidad de productos en el carrito
  static async setQuantity(
    clienteId: number,
    productoId: number,
    cantidad: number
  ) {
    await pool.query(
      `
      UPDATE "CarritoCompras"
      SET cantidad = $3
      WHERE id_cliente = $1 AND id_producto = $2
      `,
      [clienteId, productoId, cantidad]
    );
  }
  

  // Vaciar el carrito de un cliente
  static async clearCart(customerId: number) {
    await pool.query(
      `
      DELETE FROM "CarritoCompras"
      WHERE id_cliente = $1
      `,
      [customerId]
    );
  }

  // Obtener id de un producto en el carrito
  static async getProductInCart(customerId: number, productId: number) {
    const { rows } = await pool.query(
      `
      SELECT id_producto
      FROM "CarritoCompras"
      WHERE id_cliente = $1 AND id_producto = $2
      `,
      [customerId, productId]
    );

    return rows[0];
  }
}
