//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 22/04/2026 */
//**********/
import { NextResponse } from "next/server";
import { Producto } from "@/services/producto/producto.service";

export async function GET() {
  try {
    const data = await Producto.getOneProducts();

    return NextResponse.json({
      ok: true,
      data
    });
  } catch (error) {
    console.error("ERROR EN categorias-preview:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}