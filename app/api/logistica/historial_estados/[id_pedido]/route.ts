/**
 * Adrien Hernandez Sanchez
 * 2026-03-20
 * Endponint para obtener el historial de estados de un pedido
 */

import { NextResponse } from "next/server";
import { LogisticaService } from "@/services/logistica/logistica.service";

/**
 * Endpoint para obtener el historial de estados de un pedido
 * @author Hernández Sánchez Adrien
 * @param req - Objeto de solicitud HTTP
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id_pedido: string }> }
) {
  try {
    const { id_pedido } = await context.params;
    const idPedido = Number(id_pedido);

    if (Number.isNaN(idPedido)) {
      return NextResponse.json(
        { ok: false, error: 'ID de pedido inválido' },
        { status: 400 }
      );
    }

    const historialEstadosPedido = await LogisticaService.obtenerHistorialEstadosPedido(idPedido);

    if (!historialEstadosPedido) {
      return NextResponse.json(
        { ok: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: historialEstadosPedido,
    });
  } catch (error: any) {
    console.error('ERROR EN /api/logistica/historial_estados/[id_pedido]:', error);

    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}