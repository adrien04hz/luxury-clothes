/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { NextResponse } from 'next/server';
import { CarritoCompras } from "@/services/carritodecompras/carritodecompras.service";
import { getUserFromToken } from "@/lib/auth";

/**
 * 
 * Obtener carrito de compras de un cliente por su ID.|
 */
export async function GET(req: Request) {
  try {

    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  
    const carrito = await CarritoCompras.getCart(user.id);
    // const { searchParams } = new URL(req.url);
    // const id_usuario = Number(searchParams.get('id_usuario'));
  
    // const carrito = await CarritoCompras.getCart(id_usuario);

    if (!carrito) {
      return NextResponse.json({ ok: false, message: 'No se pudo obtener el carrito' }, { status: 400 });
    }
  
    return NextResponse.json({
      ok: true,
      count: carrito.length,
      data: carrito
    });

  } catch (error: any ) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );  
  }
}

/**
 * Función para agregar un producto al carrito de compras de un cliente.
 * @param req - JSON que contiene id_usuario, id_producto, id_talla, cantidad
 * @returns boolean - True para indicar que se ha modificado 
 * la tabla de CarritoCompras
 */
export async function POST(req: Request) {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id_producto, id_talla, cantidad } = await req.json();

    const result = await CarritoCompras.addProduct({ id_usuario: user.id, id_producto, id_talla, cantidad });

    if (!result) {
      return NextResponse.json({ ok: false, message: 'No se pudo agregar el producto al carrito' }, { status: 400 });
    }

    return NextResponse.json({ ok: result, message: 'Producto agregado al carrito' });
  } catch (error: any) {
      return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error interno',
      },
      { status: 500 }
    );
  }
}

/**
 * Función para eliminar un producto del carrito de compras de un cliente.
 * @param req - JSON que contiene id_usuario, id_producto, id_talla, cantidad
 * @returns boolean - True para indicar que se ha modificado 
 * la tabla de CarritoCompras
 */
export async function DELETE(req: Request) {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id_producto, id_talla } = await req.json();

    const result = await CarritoCompras.deleteProduct({ id_usuario: user.id, id_producto, id_talla });
    // const { id_usuario, id_producto, id_talla } = await req.json();
    
    // const result = await CarritoCompras.deleteProduct({ id_usuario, id_producto, id_talla });

    if (!result) {
      return NextResponse.json({ ok: false, message: 'No se pudo eliminar el producto del carrito' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: 'Producto eliminado del carrito' });

  } catch (error: any) {
      return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error interno',
      },
      { status: 500 }
    );
  }
}


/**
 * Función para actualizar la cantidad de un producto en el carrito de compras de un cliente.
 * @param req - JSON que contiene clienteId, cantidad, flag
 * @returns boolean - True para indicar que se ha modificado
 */
export async function PUT(
  req: Request
) {
  let result = false;
  try {

    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id_producto, id_talla, cantidad, flag } = await req.json();

    if (flag === 'increase') {
      result = await CarritoCompras.increaseQuantityProduct({id_usuario: user.id, id_producto, id_talla, cantidad});
    } else if (flag === 'decrease') {
      result = await CarritoCompras.decreaseQuantityProduct({id_usuario: user.id, id_producto, id_talla, cantidad});
    } else {
        throw new Error('Flag inválida. Debe ser "increase" o "decrease".');
    }

    if (!result) {
      return NextResponse.json({ ok: false, message: 'No se pudo actualizar la cantidad del producto en el carrito' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Cantidad actualizada',
    });

  } catch (error: any) {
    console.error('PUT /api/carrito/', error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Error al actualizar cantidad',
      },
      { status: 500 }
    );
  }
}