//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 25/02/2026 */
//**********/

import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;
    const idPedido = Number(id);

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
      { status: 404 }
    );

  }

}