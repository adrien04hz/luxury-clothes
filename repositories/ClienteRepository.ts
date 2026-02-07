//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 06/02/2026 */
//**********/
import { pool } from "@/lib/db";

export class ClienteRepository {
  static async findByCorreo(correo: string) {
    return pool.query(
      `SELECT * FROM "Cliente"
       WHERE correo = $1 AND activo = true`,
      [correo]
    );
  }

  static async existsByCorreo(correo: string) {
    return pool.query(
      `SELECT id FROM "Cliente"
       WHERE correo = $1`,
      [correo]
    );
  }

  static async create(data: any) {
    return pool.query(
      `INSERT INTO "Cliente"
      (nombre, apellidos, correo, contrasena, telefono, foto_perfil)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        data.nombre,
        data.apellidos,
        data.correo,
        data.contrasena,
        data.telefono || null,
        data.foto_perfil || null,
      ]
    );
  }
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 06/02/2026 */
//**********/

  static async findById(id: number | string) {
    return pool.query(
      `SELECT * FROM "Cliente"
       WHERE id = $1 AND activo = true`,
      [id]
    );
  }

  static async updateById(id: number | string, data: Partial<any>) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex++}`);
      values.push(data.nombre);
    }
    if (data.apellidos !== undefined) {
      fields.push(`apellidos = $${paramIndex++}`);
      values.push(data.apellidos);
    }
    if (data.correo !== undefined) {
      fields.push(`correo = $${paramIndex++}`);
      values.push(data.correo);
    }
    if (data.contrasena !== undefined) {
      fields.push(`contrasena = $${paramIndex++}`);
      values.push(data.contrasena);
    }
    if (data.telefono !== undefined) {
      fields.push(`telefono = $${paramIndex++}`);
      values.push(data.telefono);
    }
    if (data.foto_perfil !== undefined) {
      fields.push(`foto_perfil = $${paramIndex++}`);
      values.push(data.foto_perfil);
    }

    if (fields.length === 0) {
      throw new Error("No hay campos para actualizar");
    }

    values.push(id);

    return pool.query(
      `UPDATE "Cliente"
       SET ${fields.join(", ")}, Cliente = NOW()
       WHERE id = $${paramIndex} AND activo = true
       RETURNING id, nombre, apellidos, correo, telefono, foto_perfil`,
      values
    );
  }

  static async deactivateById(id: number | string) {
    return pool.query(
      `UPDATE "Cliente"
       SET activo = false, Cliente = NOW()
       WHERE id = $1 AND activo = true
       RETURNING id`,
      [id]
    );
  }
}