/**
 * Adrien Hernandez Sanchez
 * 2026-04-10
 * Equipo 1
 */

import { NextResponse } from "next/server";
import { LogisticaService } from "@/services/logistica/logistica.service";

/**
 * Endpoint para obtener pedidos sin estado completado
 * @author Hernández Sánchez Adrien
 */
export async function GET() {
  try {

    const pedidosSinEstadoCompletado = await LogisticaService.obtenerPedidosSinEstadoCompletado();

    if (!pedidosSinEstadoCompletado) {
      return NextResponse.json(
        { ok: false, error: 'No se encontraron pedidos sin estado completado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: pedidosSinEstadoCompletado,
    });
  } catch (error: any) {
    console.error('ERROR EN /api/logistica/pedido/:', error);

    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}