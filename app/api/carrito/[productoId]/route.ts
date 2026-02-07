/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { NextResponse } from 'next/server';
import { CarritoCompras } from "@/services/CarritoCompras";


export async function PUT(
  req: Request,
  context: { params: Promise<{ productoId: string }> }
) {
  try {
    const { clienteId, cantidad, flag } = await req.json();
    const { productoId } = await context.params;
    const productId = Number(productoId);

    if (flag === 'increase') {
        await CarritoCompras.increaseQuantityProduct(clienteId, productId, cantidad);
    } else if (flag === 'decrease') {
        await CarritoCompras.decreaseQuantityProduct(clienteId, productId, cantidad);
    } else {
        throw new Error('Flag inválida. Debe ser "increase" o "decrease".');
    }

    return NextResponse.json({
      ok: true,
      message: 'Cantidad actualizada',
    });

  } catch (error: any) {
    console.error('PUT /api/carrito/[productoId]', error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error al actualizar cantidad',
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ productoId: string }> }
) {
  try {
    const { clienteId } = await req.json();
    const { productoId } = await context.params;
    const productId = Number(productoId);

    await CarritoCompras.deleteProduct(clienteId, productId);

    return NextResponse.json({
      ok: true,
      message: 'Producto eliminado del carrito',
    });
  } catch (error: any) {
    console.error('DELETE /api/carrito/[productoId]', error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error al eliminar producto del carrito',
      },
      { status: 500 }
    );
  }
}

