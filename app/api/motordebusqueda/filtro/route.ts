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

    const palabra = searchParams.get("q");
    const idCategoria = searchParams.get("categoria");
    const idMarca = searchParams.get("marca");
    const precioMin = searchParams.get("precioMin");
    const precioMax = searchParams.get("precioMax");
    const stock = searchParams.get("stock");

    const data = await FiltroArticuloService.filtrar({
      palabra: palabra || undefined,
      idCategoria: idCategoria ? Number(idCategoria) : undefined,
      idMarca: idMarca ? Number(idMarca) : undefined,
      precioMin: precioMin ? Number(precioMin) : undefined,
      precioMax: precioMax ? Number(precioMax) : undefined,
      soloActivos: true,
      conStock: stock === "true"
    });

    return NextResponse.json(data);

  } catch (error: any) {

    console.error("ERROR EN /api/motordebusqueda/filtro:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}