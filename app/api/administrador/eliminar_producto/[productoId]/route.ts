//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { AdministradorRepository } from "@/repositories/administrador.repositories";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ error: "Se requiere el parámetro ?id=" }, { status: 400 });
    }

    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const result = await AdministradorRepository.desactivarProducto(id);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado o ya inactivo" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Producto eliminado correctamente (desactivado)",
    });
  } catch (error: any) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}