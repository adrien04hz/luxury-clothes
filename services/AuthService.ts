/**
 * AuthService
 * Equipo: ---
 * Autor: Abdiel
 * Fecha: 2026
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ClienteRepository } from "@/repositories/ClienteRepository";

export class AuthService {
  /* =====================
     REGISTRO
  ===================== */
  static async register(data: any) {
    const exists = await ClienteRepository.existsByCorreo(data.correo);
    if (exists.rows.length > 0) {
      throw new Error("El correo ya está registrado");
    }
    const hash = await bcrypt.hash(data.contrasena, 10);
    await ClienteRepository.create({
      ...data,
      contrasena: hash
    });
  }

  /* =====================
     LOGIN
  ===================== */
  static async login(correo: string, contrasena: string) {
    const result = await ClienteRepository.findByCorreo(correo);
    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      throw new Error("Contraseña incorrecta");
    }
    const token = jwt.sign(
      {
        id: user.id,
        correo: user.correo
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );
    return token;
  }

  /* =====================
     OBTENER PERFIL
  ===================== */
  static async obtenerPerfil(clienteId: number) {
    const result = await ClienteRepository.findById(clienteId);
    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado o cuenta inactiva");
    }
    const { contrasena, ...perfil } = result.rows[0];
    return perfil;
  }

  /* =====================
     ACTUALIZAR PERFIL
  ===================== */
  static async actualizarPerfil(clienteId: number, datos: any) {
    const updates: any = {};

    if (datos.nombre !== undefined) updates.nombre = datos.nombre;
    if (datos.apellidos !== undefined) updates.apellidos = datos.apellidos;
    if (datos.telefono !== undefined) updates.telefono = datos.telefono;
    if (datos.foto_perfil !== undefined) updates.foto_perfil = datos.foto_perfil;

    // Validar cambio de correo
    if (datos.correo) {
      const existe = await ClienteRepository.existsByCorreo(datos.correo);
      if (existe.rows.length > 0) {
        // Aquí podrías comparar con el correo actual del usuario
        throw new Error("El correo ya está registrado");
      }
      updates.correo = datos.correo;
    }

    // Cambio de contraseña
    if (datos.nueva_contrasena) {
      if (!datos.contrasena_actual) {
        throw new Error("Debes proporcionar la contraseña actual");
      }
      const usuario = await ClienteRepository.findById(clienteId);
      if (usuario.rows.length === 0) {
        throw new Error("Cliente no encontrado");
      }
      const match = await bcrypt.compare(datos.contrasena_actual, usuario.rows[0].contrasena);
      if (!match) {
        throw new Error("Contraseña actual incorrecta");
      }
      updates.contrasena = await bcrypt.hash(datos.nueva_contrasena, 10);
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No se proporcionaron campos para actualizar");
    }

    await ClienteRepository.updateById(clienteId, updates);
  }

  /* =====================
     DESACTIVAR CUENTA
  ===================== */
  static async desactivarCuenta(clienteId: number) {
    const result = await ClienteRepository.deactivateById(clienteId);
    if (result.rowCount === 0) {
      throw new Error("Cuenta no encontrada o ya está desactivada");
    }
  }
}