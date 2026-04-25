import { NextResponse } from "next/server";
import { ProductoService } from "@/services/administrador/administrador.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const stock = await ProductoService.obtenerStockProducto(productId);

    return NextResponse.json({
      stock: stock || [],
    });

  } catch (error: any) {
    console.error("ERROR STOCK:", error);

    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}