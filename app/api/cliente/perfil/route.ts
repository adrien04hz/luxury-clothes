//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
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

    // 🔥 ESTA ES LA CORRECCIÓN CLAVE
    const cliente = await ClienteRepository.findById(user.id);

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado o cuenta inactiva" },
        { status: 404 }
      );
    }

    const { contrasena, ...perfil } = cliente;

    return NextResponse.json(perfil);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}