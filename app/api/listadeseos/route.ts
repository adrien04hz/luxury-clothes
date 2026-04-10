/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 6 de febrero de 2026
 */

import { NextResponse } from "next/server";
import { ListaDeseos } from "@/services/listadedeseo/listadedeseo.service";
import { getUserFromToken } from "@/lib/auth";

//endpoint que permite obtener los productos de la lista de deseos de un cliente, recibe el id del cliente como query parameter
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    
     if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }
  

 /*    const user = getUserFromToken(req);
    console.log("USER:", user);
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 }
      );
    }
    */
    const products = await ListaDeseos.getWhishlist(Number(clientId));

    return NextResponse.json({
      ok: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

//endpoint que permite agregar un producto a la lista de deseos de un cliente, recibe el id del cliente y el id del producto como query parameters

export async function POST(req: Request) {
  try {
    const { clientId, productId } = await req.json();

    if (!clientId || !productId) {
      return NextResponse.json(
        { error: 'Client ID and Product ID are required' },
        { status: 400 }
      );
    }

    await ListaDeseos.addProduct(clientId, productId);

    return NextResponse.json({
      ok: true,
      message: 'Producto agregado a la lista de deseos',
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try{
    const { clientId, productId } = await req.json();
    if (!clientId || !productId) {
      return NextResponse.json(
        { error: 'Client ID and Product ID are required' },
        { status: 400 }
      );
    }

    await ListaDeseos.deleteProduct(clientId, productId);

    return NextResponse.json({
      ok: true,
      message: 'Producto eliminado de la lista de deseos',
    });

  }catch (error){
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });

  }
  
}
