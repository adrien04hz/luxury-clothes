//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 11/03/2026 */
//**********/
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

export class LogisticaRepository {

  // =============================================
  // Ver estado actual del pedido
  // =============================================
  static async obtenerEstadoPedido(idPedido: number): Promise<QueryResult> {
    return pool.query(
      `SELECT 
         p.id AS id_pedido,
         ep.nombre AS estado,
         ep.descripcion,
         p.fecha
       FROM "Pedido" p
       JOIN "EstadoPedido" ep ON p.id_estado_pedido = ep.id
       WHERE p.id = $1`,
      [idPedido]
    );
  }

  // =============================================
  // Cambiar estado del pedido (con historial)
  // =============================================
  static async actualizarEstadoPedido(
    idPedido: number,
    idNuevoEstado: number,
    idUsuarioLogistica: number
  ): Promise<QueryResult> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const updatePedido = await client.query(
        `UPDATE "Pedido"
         SET id_estado_pedido = $1
         WHERE id = $2
         RETURNING id, id_estado_pedido`,
        [idNuevoEstado, idPedido]
      );

      if (updatePedido.rowCount === 0) {
        throw new Error("Pedido no encontrado");
      }

      const insertHistorial = await client.query(
        `INSERT INTO "HistorialEstadoPedido" 
           (id_pedido, id_estado_pedido, id_usuario)
         VALUES ($1, $2, $3)
         RETURNING id, fecha`,
        [idPedido, idNuevoEstado, idUsuarioLogistica]
      );

      await client.query('COMMIT');

      return {
        ...updatePedido,
        historial: insertHistorial.rows[0]
      } as any;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // =============================================
  // Información completa para repartidor
  // =============================================
  static async obtenerInformacionPedido(idPedido: number): Promise<QueryResult> {
    return pool.query(
      `SELECT 
         p.id AS id_pedido,
         p.total,
         p.fecha,
         ep.nombre AS estado_actual,
         ep.descripcion AS estado_descripcion,
         
         u.id AS id_cliente,
         u.nombre AS nombre_cliente,
         u.apellidos AS apellidos_cliente,
         
         d.id AS id_direccion,
         d.estado,
         d.ciudad,
         d.codigo_postal,
         d.calle,
         d.numero_exterior,
         d.numero_interior,
         d.colonia,
         
         e.numero_guia,
         e.fecha_envio,
         e.fecha_entrega_estimada
       FROM "Pedido" p
       JOIN "EstadoPedido" ep ON p.id_estado_pedido = ep.id
       JOIN "Usuario" u ON p.id_usuario = u.id
       LEFT JOIN "Envio" e ON e.id_pedido = p.id
       LEFT JOIN "DireccionEnvio" d ON e.id_direccion = d.id
       WHERE p.id = $1
         AND u.activo = true`,
      [idPedido]
    );
  }

  /**
   * Función para obtener el historial de estados de un pedido
   * @author Hernández Sánchez Adrien
   * @param id_Pedido - ID del pedido
   * @returns Historial de estados del pedido
   */
  static async getHistorialEstadosPedido(id_Pedido: number) {
    const { rows } = await pool.query(
      `SELECT
        E.nombre AS estado,
        H.fecha
      FROM "HistorialEstadoPedido" H
      INNER JOIN "EstadoPedido" E
        ON H.id_estado_pedido = E.id
      WHERE H.id_pedido = $1
      ORDER BY H.fecha ASC;`,
      [id_Pedido]
    );
  
    return rows;
  }
  
  
  /**
   * Función para obtener Envio
   * @param id_pedido - ID del pedido
   * @return Información del envío asociado al pedido
   */
  static async getEnvioByPedido(id_pedido: number) {
    const { rows } = await pool.query(
      `
      SELECT
        E.numero_guia,
        ES.nombre AS estado_envio,
        E.fecha_envio,
        E.fecha_entrega_estimada,
        D.calle,
        D.numero_exterior,
        D.numero_interior,
        D.colonia,
        D.ciudad,
        D.estado,
        D.codigo_postal
      FROM "Envio" E
      INNER JOIN "EstadoEnvio" ES
        ON E.id_estado_envio = ES.id
      INNER JOIN "DireccionEnvio" D
        ON E.id_direccion = D.id
      WHERE E.id_pedido = $1;
      `
    , [id_pedido]);
  
    return rows[0];
  }
}
