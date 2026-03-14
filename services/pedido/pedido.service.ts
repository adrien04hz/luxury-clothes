//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 25/02/2026 */
//**********/

import { PedidoRepository } from "@/repositories/pedido/pedido.repository";

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

}


  //***********/
  //* Nombre del equipo: Equipo 1 */
  //* Autor de la clase: Ramos Bello Jose Luis */
  //* Fecha: 25/02/2026 */
  //**********/

  /************************************/
  // Cancelaion de pedido
  //************************************/

//   static async cancelarPedido(id: number) {
//     const result: QueryResult = await PedidoRepository.cancelarPedido(id);

//     if (result.rowCount === 0) {
//       throw new Error("El pedido no existe o no se puede cancelar en su estado actual");
//     }

//     const pedido = result.rows[0];
//     return {
//       mensaje: "Pedido cancelado correctamente",
//       pedidoId: pedido.id,
//       nuevoEstado: pedido.estado,
//     };
//   }

//   //************************************/
//   // Estado de pedido
//   //************************************/

//   static async obtenerEstadoPedido(id: number) {
//     const result: QueryResult = await PedidoRepository.estadoPedido(id);

//     if (result.rowCount === 0) {
//       throw new Error("Pedido no encontrado");
//     }

//     return result.rows[0];
//   }

//   //************************************/
//   // Proceso de compra de pedido
//   //************************************/

//   static async procesarCompra(
//     idCliente: number,
//     idMetodoPago: number,
//     idDireccion: number,
//     notas?: string
//   ) {
//     try {
//       const result = await PedidoRepository.crearPedidoDesdeCarrito(
//         idCliente,
//         idMetodoPago,
//         idDireccion,
//         notas
//       );

//       if (result.rowCount === 0) {
//         throw new Error("No se pudo crear el pedido");
//       }

//       return result.rows[0];
//     } catch (error: any) {
//       throw new Error(error.message || "Error al procesar la compra");
//     }
//   }

// }