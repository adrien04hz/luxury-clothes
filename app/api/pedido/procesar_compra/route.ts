//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 27/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { id_metodo_pago, id_direccion, notas } = body;

    if (
      id_metodo_pago == null ||
      id_direccion == null ||
      typeof id_metodo_pago !== "number" ||
      typeof id_direccion !== "number" ||
      id_metodo_pago <= 0 ||
      id_direccion <= 0
    ) {
      return NextResponse.json(
        { error: "Datos inválidos: método de pago y dirección son requeridos" },
        { status: 400 }
      );
    }

    const idCliente = user.id;

    const pedidoCreado = await PedidoService.procesarCompra(
      idCliente,
      id_metodo_pago,
      id_direccion,
      notas
    );

    if (!pedidoCreado) {
      return NextResponse.json(
        { error: "No se pudo procesar el pedido" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Compra procesada correctamente",
        data: pedidoCreado
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error al procesar la compra:", error);

    const message = error.message?.toLowerCase() || "";

    let status = 500;
    if (message.includes("carrito") || message.includes("stock")) {
      status = 400;
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al procesar la compra",
      },
      { status }
    );
  }
}