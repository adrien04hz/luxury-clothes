import { NextResponse } from "next/server";
import { PedidoService } from "@/services/PedidoService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;

    const idCliente = Number(id);

    if (isNaN(idCliente)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const historial =
      await PedidoService.obtenerHistorialCliente(idCliente);

    return NextResponse.json(historial);

  } catch (error) {

    return NextResponse.json(
      { error: "Error al obtener historial" },
      { status: 500 }
    );

  }

}