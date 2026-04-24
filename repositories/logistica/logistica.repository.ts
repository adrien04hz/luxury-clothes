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

  /**
   * Función para obtener el estado del envío de un pedido
   * @author Hernández Sánchez Adrien
   * @param idPedido - ID del pedido
   * @returns Estado del envío del pedido
   */
    static async obtenerEstadoEnvio(idPedido: number): Promise<QueryResult> {
    return pool.query(
      `SELECT 
         e.id_pedido AS id_pedido,
         ep.nombre AS estado,
         ep.descripcion,
         e.fecha_envio,
         e.fecha_entrega_estimada
       FROM "Envio" e
       JOIN "EstadoEnvio" ep ON e.id_estado_envio = ep.id
       WHERE e.id_pedido = $1`,
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
      `
        SELECT
          E.nombre AS estado_pedido,
          EE.nombre as estado_envio,
          H.fecha
        FROM "HistorialEstadoPedido" H
        LEFT JOIN "EstadoPedido" E ON H.id_estado_pedido = E.id
        LEFT JOIN "EstadoEnvio" EE ON H.id_estado_envio = EE.id
        WHERE H.id_pedido = $1
        ORDER BY H.fecha ASC;
      `,
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

  /**
   * Función para actualizar el estado del envio
   * @author Adrien Hernández Sánchez
   * @param idPedido - ID del pedido a actualizar 
   * @param idNuevoEstado - Nuevo estado del envío
   * @param idUsuarioLogistica - ID del usuario que realiza la actualización
   */
  static async actualizarEstadoEnvioPedido(
    idPedido: number,
    idNuevoEstado: number,
    idUsuarioLogistica: number
  ): Promise<QueryResult> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const updatePedido = await client.query(
        `UPDATE "Envio"
         SET id_estado_envio = $1
         WHERE id_pedido = $2
         RETURNING id, id_estado_envio`,
        [idNuevoEstado, idPedido]
      );

      if (updatePedido.rowCount === 0) {
        throw new Error("Pedido no encontrado");
      }

      const insertHistorial = await client.query(
        `INSERT INTO "HistorialEstadoPedido" 
           (id_pedido, id_estado_envio, id_usuario)
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

  /**
   * Función para obtener los envíos que no sean entregados
   * @author Hernández Sánchez Adrien
   * @returns Lista de envíos sin entregar y no cancelados
   */
  static async obtenerEnviosSinEntregar() {
    const { rows } = await pool.query(
      `
        SELECT
          P.id as id_pedido,
          U.nombre as cliente_nombre,
          U.apellidos as cliente_apellido,
          E.fecha_entrega_estimada as fecha_estimada,
          E.numero_guia as numero_guia,
          EE.nombre as estado_envio
        FROM "Envio" E
        
        JOIN "Pedido" P ON E.id_pedido = P.id
        JOIN "Usuario" U ON P.id_usuario = U.id
        JOIN "Rol" R ON U.id_rol = R.id
        JOIN "EstadoEnvio" EE ON E.id_estado_envio = EE.id

        WHERE R.id = 1
        AND E.id_estado_envio != 5;
      `
    );

    return rows;
  }

  /**
   * Función para obtener los pedidos que no tengan estado
   * de pedido completado
   * @author Hernández Sánchez Adrien
   * @returns Lista de pedidos sin estado completado
   */
  static async obtenerPedidosSinEstadoCompletado() {
    const query = `
      SELECT
        P.id as id_pedido,
        U.nombre as cliente_nombre,
        U.apellidos as cliente_apellido,
        EP.nombre as estado_pedido
      FROM "Pedido" P
      
      JOIN "Usuario" U ON P.id_usuario = U.id
      JOIN "Rol" R ON U.id_rol = R.id
      JOIN "EstadoPedido" EP ON P.id_estado_pedido = EP.id

      WHERE R.id = 1
      AND P.id_estado_pedido != 5;
    `;

    const { rows } = await pool.query(query);
    return rows;
  }
}
