//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 11/03/2026 */
//**********/
import { LogisticaRepository } from "@/repositories/logistica/logistica.repository";
import { QueryResult } from 'pg';

export class LogisticaService {

  static async obtenerEstadoPedido(idPedido: number) {
    const result: QueryResult = await LogisticaRepository.obtenerEstadoPedido(idPedido);
    
    if (result.rowCount === 0) {
      throw new Error("Pedido no encontrado");
    }
    
    return result.rows[0];
  }

  /**
   * Función para obtener el estado del envío de un pedido
   * @author Hernández Sánchez Adrien
   * @param idPedido - ID del pedido
   * @returns Estado del envío del pedido
   */
  static async obtenerEstadoEnvio(idPedido: number) {
    const result: QueryResult = await LogisticaRepository.obtenerEstadoEnvio(idPedido);
    
    if (result.rowCount === 0) {
      throw new Error("Pedido no encontrado o no tiene información de envío");
    }
    
    return result.rows[0];
  }

  /**
   * Función que actualiza el estado de un pedido y registra el cambio en el historial de forma automática
   * @author Ramos Bello José Luis
   * @param idPedido - ID del pedido a actualizar
   * @param idNuevoEstado - Nuevo estado del pedido
   * @param idUsuarioLogistica - ID del usuario que actualiza
   */
  static async actualizarEstadoPedido(
    idPedido: number,
    idNuevoEstado: number,
    idUsuarioLogistica: number
  ) {
    if (!idNuevoEstado) {
      throw new Error("Debe especificar el nuevo estado");
    }

    const result = await LogisticaRepository.actualizarEstadoPedido(
      idPedido,
      idNuevoEstado,
      idUsuarioLogistica
    );

    return {
      mensaje: "Estado del pedido actualizado correctamente",
      id_pedido: idPedido,
      nuevo_estado: idNuevoEstado,
      historial_id: result.rows[0]?.historial_id
    };
  }

  /**
   * Función que actualiza el estado de un pedido y registra el cambio en el historial de forma automática
   * @author Hernández Sánchez Adrien
   * @param idPedido - ID del pedido a actualizar
   * @param idNuevoEstado - Nuevo estado del pedido
   * @param idUsuarioLogistica - ID del usuario que actualiza
   */
  static async actualizarEstadoEnvio(
    idPedido: number,
    idNuevoEstado: number,
    idUsuarioLogistica: number
  ) {
    if (!idNuevoEstado) {
      throw new Error("Debe especificar el nuevo estado");
    }

    const result = await LogisticaRepository.actualizarEstadoEnvioPedido(
      idPedido,
      idNuevoEstado,
      idUsuarioLogistica
    );

    return {
      mensaje: "Estado del envío actualizado correctamente",
      id_pedido: idPedido,
      nuevo_estado: idNuevoEstado,
      historial_id: result.rows[0]?.historial_id
    };
  }

  static async obtenerInformacionPedido(idPedido: number) {
    const result: QueryResult = await LogisticaRepository.obtenerInformacionPedido(idPedido);
    
    if (result.rowCount === 0) {
      throw new Error("Pedido no encontrado o no tiene información de envío");
    }
    
    return result.rows[0];
  }

  /**
   * Función para obtener el historial de estados de un pedido
   * @author Hernández Sánchez Adrien
   * @param id_pedido - ID del pedido a consultar
   * @return Historial de estados del pedido
   */
  static async obtenerHistorialEstadosPedido( id_pedido: number ) {
    return await LogisticaRepository.getHistorialEstadosPedido( id_pedido );
  }

  /**
   * Función para obtener Envio de pedido por id de pedido
   * @author Hernández Sánchez Adrien
   * @param id_pedido - ID del pedido a consultar
   * @return Información de envío del pedido
   */
  static async obtenerEnvioPedido( id_pedido: number ) {
    return await LogisticaRepository.getEnvioByPedido( id_pedido );
  }

  /**
   * Función para obtener los envíos que no sean entregados
   * @author Hernández Sánchez Adrien
   * @return Lista de envíos sin entregar y no cancelados
   */
  static async obtenerEnviosNoEntregados() {
    return await LogisticaRepository.obtenerEnviosSinEntregar();
  }

  /**
   * Función para obtener los pedidos con estado de pedido
   * no completados
   * @author Hernández Sánchez Adrien
   * @return Lista de pedidos sin estado completado
   */
  static async obtenerPedidosSinEstadoCompletado() {
    return await LogisticaRepository.obtenerPedidosSinEstadoCompletado();
  }
}