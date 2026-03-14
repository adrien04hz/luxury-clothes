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

  static async obtenerInformacionPedido(idPedido: number) {
    const result: QueryResult = await LogisticaRepository.obtenerInformacionPedido(idPedido);
    
    if (result.rowCount === 0) {
      throw new Error("Pedido no encontrado o no tiene información de envío");
    }
    
    return result.rows[0];
  }
}