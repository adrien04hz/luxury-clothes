// app/api/administrador/lista_producto/route.ts
import { NextResponse } from "next/server";
import { ProductoService } from "@/services/administrador/administrador.service";

export async function GET() {
  try {
    const productos = await ProductoService.listaProductos();

    return NextResponse.json({
      success: true,
      productos,
      total: productos.length,
    });
  } catch (error: any) {
    console.error("Error al listar productos:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener productos" },
      { status: 500 }
    );
  }
}