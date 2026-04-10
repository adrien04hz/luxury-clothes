//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 25/02/2026 */
//**********/

import { PedidoRepository } from "@/repositories/pedido/pedido.repository";
import { QueryResult } from "pg";

export class PedidoService {

  //************************************/
  // Obtener detalle de un pedido
  //************************************/
  static async getDetalle(idPedido: number) {

    const result = await PedidoRepository.getDetallePedido(idPedido);

    if (result.rows.length === 0) {
      throw new Error("Pedido no encontrado");
    }

    return result.rows;
  }

  //************************************/
  // Historial de pedidos del usuario
  //************************************/
  static async obtenerHistorialUsuario(idUsuario: number) {

    const historial: any =
      await PedidoRepository.obtenerHistorialCliente(idUsuario);

    return historial;
  }

  //************************************/
  // Obtener comprobante de pago
  //************************************/
  static async obtenerComprobante(idPedido: number) {

    const result =
      await PedidoRepository.obtenerComprobante(idPedido);

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

  //************************************/
  // Cancelación de pedido
  //************************************/

  static async cancelarPedido(
    idPedido: number,
    idUsuarioQueCancela: number,
    motivo?: string
  ) {
    try {
      const result: QueryResult = await PedidoRepository.cancelarPedido(
        idPedido,
        idUsuarioQueCancela,
        motivo
      );

      if (result.rowCount === 0) {
        throw new Error(
          "El pedido no existe o no se puede cancelar en su estado actual"
        );
      }

      const estadoActualizado = await PedidoService.obtenerEstadoPedido(idPedido);

      return {
        mensaje: "Pedido cancelado correctamente",
        pedidoId: idPedido,
        nuevoEstado: estadoActualizado.estado,
        fechaCambio: new Date().toISOString(),
        motivo: motivo || "No especificado",
      };
    } catch (error: any) {
      throw new Error(error.message || "Error al intentar cancelar el pedido");
    }
  }

  //************************************/
  // Consultar estado actual del pedido
  //************************************/

  static async obtenerEstadoPedido(idPedido: number) {
    try {
      const result: QueryResult = await PedidoRepository.estadoPedido(idPedido);

      if (result.rowCount === 0) {
        throw new Error("Pedido no encontrado");
      }

      return result.rows[0];
    } catch (error: any) {
      throw new Error(error.message || "Error al consultar el estado del pedido");
    }
  }

  //************************************/
  // Procesar compra
  //************************************/

  static async procesarCompra(
    idUsuario: number,
    idTipoMetodoPago: number,
    idDireccionEnvio: number,
    notas?: string
  ) {
    try {
      const result: QueryResult = await PedidoRepository.crearPedidoDesdeCarrito(
        idUsuario,
        idTipoMetodoPago,
        idDireccionEnvio,
        notas
      );

      if (result.rowCount === 0) {
        throw new Error("No se pudo crear el pedido");
      }

      const pedidoCreado = result.rows[0];

      return {
        id: pedidoCreado.id,
        total: pedidoCreado.total,
        estado: pedidoCreado.estado,
        fecha: pedidoCreado.fecha,
      };
    } catch (error: any) {
      if (error.message.includes("stock")) {
        throw new Error("No hay stock suficiente para uno o más productos");
      }
      if (error.message.includes("carrito está vacío")) {
        throw new Error("El carrito está vacío o los productos no están disponibles");
      }
      throw new Error(error.message || "Error al procesar la compra");
    }
  }

  static async obtenerDetallePedidoRecienCreado(idPedido: number) {
    return this.obtenerEstadoPedido(idPedido);
  }
}