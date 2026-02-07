/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 */

import { NextResponse } from 'next/server';
import { BusquedaArticuloService } from '@/services/BusquedaArticuloService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const palabra = searchParams.get('q') || '';

    const resultados =
      await BusquedaArticuloService.buscarArticulo(palabra);

    return NextResponse.json({
      ok: true,
      count: resultados.length,
      data: resultados,
    });

  } catch (error) {
    console.error('ERROR EN /api/busqueda:', error);

    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
