/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { NextResponse } from 'next/server';
import { Producto } from '@/services/Producto';

export async function GET(
  req: Request,
  context: { params: Promise<{ productoId: string }> }
) {
  try {
    const { productoId } = await context.params;
    const productId = Number(productoId);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { ok: false, error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

    const productDetails = await Producto.getProductDetails(productId);

    if (!productDetails) {
      return NextResponse.json(
        { ok: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: productDetails,
    });
  } catch (error: any) {
    console.error('ERROR EN /api/producto/[productoId]:', error);

    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}