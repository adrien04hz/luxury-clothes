/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 24 de febrero de 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { MetodoDePagoService } from '@/services/metododepago/metododepago.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");

    if (!clienteId) {
      return NextResponse.json(
        { ok: false, error: "clienteId es requerido" },
        { status: 400 }
      );
    }

    const id_cliente = Number(clienteId);

    if (Number.isNaN(id_cliente)) {
      return NextResponse.json(
        { ok: false, error: "clienteId inválido" },
        { status: 400 }
      );
    }

    const metodos = await MetodoDePagoService.VerMetodos(id_cliente);

    return NextResponse.json({
      ok: true,
      data: metodos
    });

  } catch (error) {

    console.error("ERROR EN /api/metododepago/vermetodos:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );

  }

}