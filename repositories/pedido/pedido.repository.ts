//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 25/02/2026 */
//**********/

import { pool } from "@/lib/db";
import { QueryResult } from 'pg';

export class PedidoRepository {

  static async getDetallePedido(idPedido: number) {
    const sql = `
      SELECT
        dp.id_pedido,
        pr.nombre AS producto,
        t.nombre AS talla,
        dp.cantidad,
        dp.precio_unitario
      FROM "DetallePedido" dp
  
      JOIN "Producto" pr
        ON pr.id = dp.id_producto
  
      JOIN "Talla" t
        ON t.id = dp.id_talla
  
      WHERE dp.id_pedido = $1
    `;
  
    return await pool.query(sql, [idPedido]);
  }

  static async obtenerHistorialCliente(idUsuario: number) {

    const sql = `
      SELECT 
        p.id AS id_pedido,
        p.fecha,
        p.total,
  
        ep.nombre AS estado,
  
        pr.id AS id_producto,
        pr.nombre AS producto,
        d.cantidad,
        d.precio_unitario
  
      FROM "Pedido" p
  
      JOIN "EstadoPedido" ep
        ON ep.id = p.id_estado_pedido
  
      JOIN "DetallePedido" d
        ON p.id = d.id_pedido
  
      JOIN "Producto" pr
        ON pr.id = d.id_producto
  
      WHERE p.id_usuario = $1
  
      ORDER BY p.fecha DESC
    `;
  
    const result = await pool.query(sql, [idUsuario]);
    return result.rows;
  }

  static async obtenerComprobante(idPedido: number) {

    const sql = `
      SELECT
        p.id AS pedido_id,
        p.fecha,
        p.total,
  
        u.nombre,
        u.apellidos,
        u.correo,
  
        pr.nombre AS producto,
        t.nombre AS talla,
  
        d.cantidad,
        d.precio_unitario,
  
        tm.nombre AS metodo_pago
  
      FROM "Pedido" p
  
      JOIN "Usuario" u
        ON u.id = p.id_usuario
  
      JOIN "DetallePedido" d
        ON d.id_pedido = p.id
  
      JOIN "Producto" pr
        ON pr.id = d.id_producto
  
      JOIN "Talla" t
        ON t.id = d.id_talla
  
      JOIN "Pago" pa
        ON pa.id_pedido = p.id
  
      JOIN "TipoMetodoDePago" tm
        ON tm.id = pa.id_tipo_metodo
  
      WHERE p.id = $1
    `;
  
    return await pool.query(sql, [idPedido]);
  }


  //***********/
  //* Nombre del equipo: Equipo 1 */
  //* Autor de la clase: Ramos Bello Jose Luis */
  //* Fecha: 23/02/2026 */
  //**********/

  //************************************/
  // Cancelacion de pedido
  //************************************/

  static async cancelarPedido(id: number): Promise<QueryResult> {
    return pool.query(
      `UPDATE "Pedido"
       SET estado = 'cancelado',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 
         AND estado NOT IN ('cancelado', 'entregado', 'en proceso')
       RETURNING id, estado, updated_at`,
      [id]
    );
  }

  //************************************/
  // Estado de pedido
  //************************************/

  static async estadoPedido(id: number): Promise<QueryResult> {
    return pool.query(
      `SELECT id, estado, fecha_pedido, total, updated_at
       FROM "Pedido"
       WHERE id = $1`,
      [id]
    );
  }

  //************************************/
  // Proceso de compra de pedido
  //************************************/

  static async crearPedidoDesdeCarrito(
    idCliente: number,
    idMetodoPago: number,
    idDireccion: number,
    notas?: string
  ): Promise<QueryResult> {
    const client = await pool.connect(); // para transacción manual

    try {
      await client.query('BEGIN');

      // Obtener productos del carrito del cliente
      const carritoResult = await client.query(
        `SELECT ci.id_producto, ci.cantidad, p.precio, p.stock
         FROM "CarritoItem" ci
         JOIN "Producto" p ON ci.id_producto = p.id
         WHERE ci.id_cliente = $1 AND p.estaActivo = true`,
        [idCliente]
      );

      if (carritoResult.rowCount === 0) {
        throw new Error("El carrito está vacío o no tiene productos válidos");
      }

      const items = carritoResult.rows;

      // Calcular total y validar stock
      let total = 0;
      for (const item of items) {
        if (item.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${item.id_producto}`);
        }
        total += item.precio * item.cantidad;
      }

      // Crear el pedido
      const pedidoResult = await client.query(
        `INSERT INTO "Pedido" (id_cliente, id_metodo_pago, id_direccion, total, estado, fecha_pedido, notas)
         VALUES ($1, $2, $3, $4, 'pendiente', CURRENT_TIMESTAMP, $5)
         RETURNING id`,
        [idCliente, idMetodoPago, idDireccion, total, notas || null]
      );

      const idPedido = pedidoResult.rows[0].id;

      // Crear detalles del pedido y resta stock
      for (const item of items) {
        await client.query(
          `INSERT INTO "DetallePedido" (id_pedido, id_producto, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [idPedido, item.id_producto, item.cantidad, item.precio]
        );

        await client.query(
          `UPDATE "Producto" SET stock = stock - $1 WHERE id = $2`,
          [item.cantidad, item.id_producto]
        );
      }

      // Vaciar carrito
      await client.query(
        `DELETE FROM "CarritoItem" WHERE id_cliente = $1`,
        [idCliente]
      );

      await client.query('COMMIT');

      return await client.query(
        `SELECT * FROM "Pedido" WHERE id = $1`,
        [idPedido]
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

}