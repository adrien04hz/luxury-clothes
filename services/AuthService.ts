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
}
