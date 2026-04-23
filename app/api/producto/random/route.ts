//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 22/04/2026 */
//**********/
import { NextResponse } from "next/server";
import { Producto } from "@/services/producto/producto.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 5;

    const productos = await Producto.getRandomProducts(limit);

    return NextResponse.json({
      ok: true,
      data: productos,
    });
  } catch (error) {
    console.error("ERROR EN /api/productos/random:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}