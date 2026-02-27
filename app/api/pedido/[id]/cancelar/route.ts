//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";
import { getUserFromToken } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  let idPedido: number = 0;
  try {
    // Verificar autenticación (ajusta según tu sistema)
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    idPedido = Number(id);

    if (isNaN(idPedido)) {
      return NextResponse.json(
        { error: "ID de pedido inválido" },
        { status: 400 }
      );
    }

    const resultado = await PedidoService.cancelarPedido(idPedido);

    return NextResponse.json({
      message: "Pedido cancelado correctamente",
      pedidoId: idPedido,
      nuevoEstado: resultado.nuevoEstado || "cancelado",
    });
  } catch (error: any) {
    console.error(`Error al cancelar pedido ${idPedido}:`, error);
    return NextResponse.json(
      { error: error.message || "No se pudo cancelar el pedido" },
      { 
        status: error.message?.includes("no existe") || 
                error.message?.includes("no se puede cancelar") ? 400 : 500 
      }
    );
  }
}