//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { AdministradorRepository } from "@/repositories/administrador.repositories";

export async function GET(req: Request) {
  try {
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