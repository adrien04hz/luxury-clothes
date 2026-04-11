//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 27/02/2026 */
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

    const historial = await ProductoService.obtenerHistorialVentas();

    return NextResponse.json({
      success: true,
      pedidos: historial,           // Cambiado a "pedidos" para que coincida mejor con frontend
      total: historial.length,
    });
  } catch (error: any) {
    console.error("Error al obtener historial de ventas:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}