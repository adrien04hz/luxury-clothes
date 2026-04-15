//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { ProductoService } from "@/services/administrador/administrador.service";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const clientes = await ProductoService.listaClientes();

    return NextResponse.json({
      success: true,
      clientes,
      total: clientes.length,
    });
  } catch (error: any) {
    console.error("Error al listar clientes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener clientes" },
      { status: 500 }
    );
  }
}