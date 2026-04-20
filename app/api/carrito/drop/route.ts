import { NextResponse } from 'next/server';
import { CarritoCompras } from "@/services/carritodecompras/carritodecompras.service";
import { getUserFromToken } from "@/lib/auth";

/**
 * Función para eliminar todos los productos del carrito de compras de un cliente.
 * @param req - JSON que contiene id_usuario
 * @returns boolean - True para indicar que se ha modificado
 * la tabla de CarritoCompras
 */
export async function DELETE (req : Request) {
  try {
    // const { id_usuario } = await req.json();

    // const result = await CarritoCompras.dropCart(id_usuario);
    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const result = await CarritoCompras.dropCart(user.id);

    if (!result) {
      return NextResponse.json({ ok: false, message: 'No se pudo vaciar el carrito' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: 'Carrito vaciado' });

  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error al vaciar el carrito',
      },
      { status: 500 }
    );
  }
}