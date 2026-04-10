/**
 * Adrien Hernandez Sanchez
 * 2026-04-10
 * Equipo 1
 */

import { NextResponse } from "next/server";
import { LogisticaService } from "@/services/logistica/logistica.service";

/**
 * Endpoint para obtener envios sin entregar y que no sean cancelados
 * @author Hernández Sánchez Adrien
 */
export async function GET() {
  try {

    const envioDePedido = await LogisticaService.obtenerEnvioPedido(idPedido);

    if (!envioDePedido) {
      return NextResponse.json(
        { ok: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: envioDePedido,
    });
  } catch (error: any) {
    console.error('ERROR EN /api/logistica/envios/[id_pedido]:', error);

    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}