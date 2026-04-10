/**
 * Adrien Hernandez Sanchez
 * 2026-04-10
 * Equipo 1
 */

import { NextResponse } from "next/server";
import { LogisticaService } from "@/services/logistica/logistica.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id_pedido: string }> }
) {
  try {

    const { id_pedido } = await context.params;
    const idPedido = Number(id_pedido);

    if (isNaN(idPedido)) {
      return NextResponse.json(
        { error: "ID de pedido inválido" },
        { status: 400 }
      );
    }

    const pedido = await LogisticaService.obtenerInformacionPedido(idPedido);

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    );

  }
}