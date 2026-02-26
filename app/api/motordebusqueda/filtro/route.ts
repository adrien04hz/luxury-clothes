/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 */

import { FiltroArticuloService } from '@/services/motordebusqueda/motordebusqueda.service';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const data = await FiltroArticuloService.filtrar({
      palabra: searchParams.get('q') || undefined,
      idCategoria: searchParams.get('categoria')
        ? Number(searchParams.get('categoria'))
        : undefined,
      idMarca: searchParams.get('marca')
        ? Number(searchParams.get('marca'))
        : undefined,
      precioMin: searchParams.get('precioMin')
        ? Number(searchParams.get('precioMin'))
        : undefined,
      precioMax: searchParams.get('precioMax')
        ? Number(searchParams.get('precioMax'))
        : undefined,
      conStock: searchParams.get('stock') === 'true'
    });

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
