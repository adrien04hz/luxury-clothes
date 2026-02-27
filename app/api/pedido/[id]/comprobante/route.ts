import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";

export async function GET(
  req: Request,
  context: any
) {

  try {

    const params = await context.params;
    const idPedido = Number(params.id);

    if (isNaN(idPedido)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const comprobante =
      await PedidoService.obtenerComprobante(idPedido);

    return NextResponse.json(comprobante);

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );

  }
}