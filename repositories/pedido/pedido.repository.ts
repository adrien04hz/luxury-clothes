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
  
      LEFT JOIN "Pago" pa
        ON pa.id_pedido = p.id
  
      LEFT JOIN "TipoMetodoDePago" tm
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
  // Cancelación de pedido
  //************************************/
  static async cancelarPedido(id: number, idUsuarioQueCancela: number, motivo: string | undefined): Promise<QueryResult> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const estadoActual = await client.query(
        `SELECT id_estado_pedido 
       FROM "Pedido" 
       WHERE id = $1`,
        [id]
      );

      if (estadoActual.rowCount === 0) {
        throw new Error("Pedido no encontrado");
      }

      const idEstadoActual = estadoActual.rows[0].id_estado_pedido;

      const estadoCancelado = await client.query(
        `SELECT id FROM "EstadoPedido" WHERE nombre ILIKE 'cancelado' LIMIT 1`
      );

      if (estadoCancelado.rowCount === 0) {
        throw new Error("No se encontró el estado 'cancelado' en la base de datos");
      }

      const idCancelado = estadoCancelado.rows[0].id;

      const estadosNoCancelables = await client.query(
        `SELECT id FROM "EstadoPedido" 
       WHERE nombre ILIKE ANY(ARRAY['cancelado','entregado','en camino','completado'])`
      );

      const idsNoCancelables = estadosNoCancelables.rows.map(r => r.id);

      if (idsNoCancelables.includes(idEstadoActual)) {
        throw new Error("El pedido ya no puede ser cancelado (estado actual no lo permite)");
      }

      const update = await client.query(
        `UPDATE "Pedido"
       SET id_estado_pedido = $1
       WHERE id = $2
       RETURNING id`,
        [idCancelado, id]
      );

      await client.query(
        `INSERT INTO "HistorialEstadoPedido" 
         (id_pedido, id_estado_pedido, id_usuario)
       VALUES ($1, $2, $3)`,
        [id, idCancelado, idUsuarioQueCancela]
      );

      await client.query('COMMIT');
      return update;

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  //************************************/
  // Estado actual del pedido
  //************************************/

  static async estadoPedido(id: number): Promise<QueryResult> {
    return pool.query(
      `SELECT 
       p.id,
       ep.nombre AS estado,
       ep.descripcion AS estado_descripcion,
       p.fecha AS fecha_pedido,
       p.total,
       p.id_usuario,
       u.nombre || ' ' || u.apellidos AS nombre_cliente
     FROM "Pedido" p
     JOIN "EstadoPedido" ep ON p.id_estado_pedido = ep.id
     JOIN "Usuario" u ON p.id_usuario = u.id
     WHERE p.id = $1`,
      [id]
    );
  }

  //************************************/
  // Crear pedido desde carrito
  //************************************/

  static async crearPedidoDesdeCarrito(
    idUsuario: number,
    idTipoMetodoPago: number,
    idDireccion: number,
    notas?: string
  ): Promise<QueryResult> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const carritoResult = await client.query(
        `SELECT 
         cc.id_producto,
         cc.id_talla,
         cc.cantidad,
         p.precio,
         s.stock
       FROM "CarritoCompras" cc
       JOIN "Producto" p ON cc.id_producto = p.id
       JOIN "StockPorTalla" s ON cc.id_producto = s.id_producto 
                             AND cc.id_talla = s.id_talla
       WHERE cc.id_usuario = $1
         AND p.activo = true
         AND s.stock >= cc.cantidad`,
        [idUsuario]
      );

      if (carritoResult.rowCount === 0) {
        throw new Error("El carrito está vacío o no hay stock suficiente para algún producto");
      }

      const items = carritoResult.rows;

      let total = 0;
      for (const item of items) {
        total += item.precio * item.cantidad;
      }

      const pedidoResult = await client.query(
        `INSERT INTO "Pedido" (
          id_usuario, 
          id_estado_pedido, 
          total, 
          fecha
        ) VALUES (
          $1, 
          (SELECT id FROM "EstadoPedido" WHERE nombre ILIKE 'pendiente' LIMIT 1),
          $2, 
          CURRENT_TIMESTAMP
        ) RETURNING id`,
        [idUsuario, total]
      );

      const idPedido = pedidoResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO "DetallePedido" (
           id_pedido, id_producto, id_talla, cantidad, precio_unitario
         ) VALUES ($1, $2, $3, $4, $5)`,
          [idPedido, item.id_producto, item.id_talla, item.cantidad, item.precio]
        );

        await client.query(
          `UPDATE "StockPorTalla"
         SET stock = stock - $1
         WHERE id_producto = $2 AND id_talla = $3`,
          [item.cantidad, item.id_producto, item.id_talla]
        );
      }

      await client.query(
        `DELETE FROM "CarritoCompras" WHERE id_usuario = $1`,
        [idUsuario]
      );

      await client.query('COMMIT');

      return await client.query(
        `SELECT p.*, ep.nombre AS estado 
       FROM "Pedido" p
       JOIN "EstadoPedido" ep ON p.id_estado_pedido = ep.id
       WHERE p.id = $1`,
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