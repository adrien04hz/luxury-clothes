//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { AdministradorRepository } from "@/repositories/administrador.repositories";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nombre || body.precio == null || body.stock == null) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, precio, stock" },
        { status: 400 }
      );
    }

    if (body.precio <= 0) {
      return NextResponse.json({ error: "El precio debe ser mayor a 0" }, { status: 400 });
    }

    if (body.stock < 0) {
      return NextResponse.json({ error: "El stock no puede ser negativo" }, { status: 400 });
    }

    const result = await AdministradorRepository.crearProducto(body);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "No se pudo crear el producto" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Producto creado exitosamente",
        producto: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error interno al crear producto" },
      { status: 500 }
    );
  }
}