//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 25/02/2026 */
//**********/

import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const { id } = await params;
  const idUsuario = Number(id);

  if (isNaN(idUsuario)) {
    return NextResponse.json(
      { error: "ID inválido" },
      { status: 400 }
    );
  }

  const historial =
    await PedidoService.obtenerHistorialUsuario(idUsuario);

  return NextResponse.json(historial);
}