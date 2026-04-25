import { NextResponse } from "next/server";
import { ProductoService } from "@/services/administrador/administrador.service";

export async function GET() {
  try {

    const dashboard = await ProductoService.obtenerDashboard();

    return NextResponse.json({
      ventas: dashboard.ventas || 0,
      usuariosActivos: dashboard.usuariosActivos || 0,
      usuariosRecientes: dashboard.usuariosRecientes || [],
      topProductos: dashboard.topProductos || []
    });

  } catch (error: any) {
    console.error("ERROR DASHBOARD:", error);

    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}