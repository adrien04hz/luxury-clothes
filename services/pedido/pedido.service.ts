/**
 * PedidoService
 * Equipo: 1
 * Autor: Abdiel
 * Fecha: 26/02/2026
 */

import { PedidoRepository } from "@/repositories/pedido/pedido.repository";
import { QueryResult } from "pg";

export class PedidoService {
  static async getDetalle(idPedido: number) {
    const result = await PedidoRepository.getDetallePedido(idPedido);
    if (result.rows.length === 0) {
      throw new Error("Pedido no encontrado");
    }
    return result.rows;
  }

  static async obtenerHistorialCliente(idCliente: number) {
    return await PedidoRepository.obtenerHistorialCliente(idCliente);
  }


  static async obtenerComprobante(idPedido: number) {
    const result = await PedidoRepository.obtenerComprobante(idPedido);
    if (result.rows.length === 0) {
      throw new Error("Pedido no encontrado");
    }
    return result.rows;
  }


  //***********/
  //* Nombre del equipo: Equipo 1 */
  //* Autor de la clase: Ramos Bello Jose Luis */
  //* Fecha: 25/02/2026 */
  //**********/

  /************************************/
  // Cancelaion de pedido
  //************************************/

  static async cancelarPedido(id: number) {
    const result: QueryResult = await PedidoRepository.cancelarPedido(id);

    if (result.rowCount === 0) {
      throw new Error("El pedido no existe o no se puede cancelar en su estado actual");
    }

    const pedido = result.rows[0];
    return {
      mensaje: "Pedido cancelado correctamente",
      pedidoId: pedido.id,
      nuevoEstado: pedido.estado,
    };
  }

  //************************************/
  // Estado de pedido
  //************************************/

  static async obtenerEstadoPedido(id: number) {
    const result: QueryResult = await PedidoRepository.estadoPedido(id);

    if (result.rowCount === 0) {
      throw new Error("Pedido no encontrado");
    }

    return result.rows[0];
  }

}