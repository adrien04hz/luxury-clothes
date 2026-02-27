//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  let id: number = 0;
  try {
    id = (await context.params).id;
    const idPedido = Number(id);

    if (isNaN(idPedido)) {
      return NextResponse.json(
        { error: "ID de pedido inválido" },
        { status: 400 }
      );
    }

    const estadoInfo = await PedidoService.obtenerEstadoPedido(idPedido);

    return NextResponse.json(estadoInfo);
  } catch (error: any) {
    console.error(`Error al obtener estado del pedido ${id}:`, error);
    return NextResponse.json(
      { error: error.message || "Pedido no encontrado" },
      { status: error.message?.includes("no encontrado") ? 404 : 500 }
    );
  }
}