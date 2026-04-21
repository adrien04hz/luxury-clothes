//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 20/04/2026 */
//**********/
import { NextResponse } from "next/server";
import { ProductoService } from "@/services/administrador/administrador.service";

export async function GET(req: Request) {
  try {

    const historial = await ProductoService.obtenerHistorialVentas();

    return NextResponse.json({
      success: true,
      pedidos: historial,
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