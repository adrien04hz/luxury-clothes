/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { NextResponse } from 'next/server';
import { Catalogo } from '@/services/Catalogo';

export async function GET() {
  try {
    const products = await Catalogo.getCatalog();
    return NextResponse.json({
      ok: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('ERROR EN /api/products:', error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

