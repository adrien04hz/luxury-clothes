//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { AdministradorRepository } from "@/repositories/administrador/administrador.repository";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
      const user = getUserFromToken(req);
      if (!user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
    const result = await AdministradorRepository.obtenerClientesActivos();

    return NextResponse.json({
      clientes: result.rows,
      total: result.rowCount,
    });
  } catch (error: any) {
    console.error("Error al listar clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de clientes" },
      { status: 500 }
    );
  }
}