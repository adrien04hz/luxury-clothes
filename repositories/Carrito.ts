/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { pool } from '@/lib/db';

export class Carrito {
  // Agregar producto al carrito, si existe, actualizar la cantidad
  static async addProduct(customerId: number, productId: number, quantity: number) {
    await pool.query(
      `
      INSERT INTO "CarritoCompras" (id_producto, id_cliente, cantidad)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_producto, id_cliente)
      DO UPDATE SET cantidad = "CarritoCompras".cantidad + $3
      `,
      [productId, customerId, quantity]
    );
  }

  // Obtener el carrito de un cliente
  static async getCartByCustomerId(customerId: number) {
    const { rows } = await pool.query(
      `
      SELECT DISTINCT ON (P.id) 
      P.id, P.nombre, P.precio, C.cantidad, I.url as imagen
      FROM "Carrito" C,
      INNER JOIN "Producto" P ON C.id_producto = P.id
      INNER JOIN "ImagenProducto" I ON P.id = I.id_producto
      WHERE C.id_cliente = $1
      `,
      [customerId]
    );

    return rows;
  }

  // Eliminar un producto del carrito
  static async removeProduct(customerId: number, productId: number) {
    await pool.query(
      `
        DELETE FROM "CarritoCompras"
        WHERE id_cliente = $1 AND id_producto = $2
      `,
      [customerId, productId]
    );
  }

  // Actualizar la cantidad de productos en el carrito
  static async setQuantity(
    clienteId: number,
    productoId: number,
    cantidad: number
  ) {
    await pool.query(
      `
      UPDATE "CarritoProducto"
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
