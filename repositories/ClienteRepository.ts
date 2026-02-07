/**
 * ClienteRepository
 * Equipo: ---
 * Autor: Abdiel
 * Fecha: 2026
 */

import { pool } from "@/lib/db";

export class ClienteRepository {

  static async findByCorreo(correo: string) {
    return pool.query(
      `SELECT * FROM "Cliente"
       WHERE correo=$1 AND activo=true`,
      [correo]
    );
  }

  static async existsByCorreo(correo: string) {
    return pool.query(
      `SELECT id FROM "Cliente"
       WHERE correo=$1`,
      [correo]
    );
  }

  static async create(data: any) {
    return pool.query(
      `INSERT INTO "Cliente"
      (nombre, apellidos, correo, contrasena, telefono, foto_perfil)
      VALUES($1,$2,$3,$4,$5,$6)`,
      [
        data.nombre,
        data.apellidos,
        data.correo,
        data.contrasena,
        data.telefono,
        data.foto_perfil
      ]
    );
  }
}
