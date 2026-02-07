//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 06/02/2026 */
//**********/
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ClienteRepository } from "@/repositories/ClienteRepository";
import { getUserFromToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    const updates: Record<string, any> = {};

    // Campos permitidos para actualizar
    if (body.nombre !== undefined) updates.nombre = body.nombre;
    if (body.apellidos !== undefined) updates.apellidos = body.apellidos;
    if (body.telefono !== undefined) updates.telefono = body.telefono;
    if (body.foto_perfil !== undefined) updates.foto_perfil = body.foto_perfil;

    // Cambio de correo → validar unicidad
    if (body.correo !== undefined && body.correo !== user.correo) {
      const existe = await ClienteRepository.existsByCorreo(body.correo);
      if (existe.rows.length > 0) {
        return NextResponse.json(
          { error: "El correo ya está registrado por otra cuenta" },
          { status: 409 }
        );
      }
      updates.correo = body.correo;
    }

    // Cambio de contraseña → requiere contraseña actual
    if (body.nueva_contrasena) {
      if (!body.contrasena_actual) {
        return NextResponse.json(
          { error: "Debes proporcionar la contraseña actual" },
          { status: 400 }
        );
      }

      const clienteResult = await ClienteRepository.findById(user.id);
      if (clienteResult.rows.length === 0) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
      }

      const match = await bcrypt.compare(
        body.contrasena_actual,
        clienteResult.rows[0].contrasena
      );

      if (!match) {
        return NextResponse.json(
          { error: "Contraseña actual incorrecta" },
          { status: 401 }
        );
      }

      updates.contrasena = await bcrypt.hash(body.nueva_contrasena, 10);
    }

    // Validar que haya algo que actualizar
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No se enviaron campos válidos para actualizar" },
        { status: 400 }
      );
    }

    const result = await ClienteRepository.updateById(user.id, updates);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No se pudo actualizar el perfil (cliente no encontrado o inactivo)" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Perfil actualizado correctamente",
      datosActualizados: result.rows[0]
    });
  } catch (error: any) {
    console.error("Error en PATCH /api/Cliente:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar perfil" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const result = await ClienteRepository.deactivateById(user.id);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Cuenta no encontrada o ya está desactivada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Cuenta desactivada correctamente"
    });
  } catch (error: any) {
    console.error("Error en DELETE /api/Cliente:", error);
    return NextResponse.json(
      { error: "Error al desactivar la cuenta" },
      { status: 500 }
    );
  }
}