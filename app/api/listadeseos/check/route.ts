import { NextResponse } from "next/server";
import { ListaDeseos } from "@/services/listadedeseo/listadedeseo.service";
import { getUserFromToken } from "@/lib/auth";


/**
 * Endpoint para ver si un producto en lista de deseos, recibe el id del cliente y el id del producto como query parameters
 * @author Adrien Hernández Sánchez 
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_producto = searchParams.get('id_producto') ? parseInt(searchParams.get('id_producto')!) : undefined;

    if (!id_producto) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    } 

    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
        
    const res = await ListaDeseos.productExistsInWishlist(user.id, id_producto);

    return NextResponse.json({
      exists: res
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}