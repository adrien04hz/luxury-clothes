import { PedidoRepository } from "@/repositories/PedidoRepository";

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
}