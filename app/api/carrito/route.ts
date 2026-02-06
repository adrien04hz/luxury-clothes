/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { NextResponse } from 'next/server';
import { CarritoCompras } from "@/services/CarritoCompras";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clienteId = Number(searchParams.get('clienteId'));
  
    const carrito = await CarritoCompras.getCart(clienteId);
  
    return NextResponse.json({
        ok: true,
        count: carrito.length,
        data: carrito
    });

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );  
  }
}



export async function POST(req: Request) {
  try {
    const { clienteId, productoId, cantidad } = await req.json();

    await CarritoCompras.addProduct(clienteId, productoId, cantidad);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error interno',
      },
      { status: 400 }
    );
  }
}
