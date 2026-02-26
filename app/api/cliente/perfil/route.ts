//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 06/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { ClienteRepository } from "@/repositories/cliente/cliente.repository";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const result = await ClienteRepository.findById(user.id);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Cliente no encontrado o cuenta inactiva" },
        { status: 404 }
      );
    }

    const cliente = result.rows[0];
    // Eliminamos la contraseña del resultado por seguridad
    const { contrasena, ...perfil } = cliente;

    return NextResponse.json(perfil);
  } catch (error: any) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: "Error interno al consultar el perfil" },
      { status: 500 }
    );
  }
}