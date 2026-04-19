//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 06/02/2026 */
//**********/

import { pool } from "@/lib/db";

export class ClienteRepository {

  static async findByCorreo(correo: string) {
    return pool.query(
      `SELECT *
       FROM "Usuario"
       WHERE correo = $1
       AND activo = true`,
      [correo]
    );
  }

  static async existsByCorreo(correo: string) {
    return pool.query(
      `SELECT id
       FROM "Usuario"
       WHERE correo = $1`,
      [correo]
    );
  }

  static async create(data: any) {
    return pool.query(
      `INSERT INTO "Usuario"
      (
        id_rol,
        nombre,
        apellidos,
        correo,
        contrasena,
        telefono,
        foto_perfil
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING id`,
      [
        1, // rol cliente
        data.nombre,
        data.apellidos,
        data.correo,
        data.contrasena,
        data.telefono || null,
        data.foto_perfil || null
      ]
    );
  }



  //***********/
  //* Nombre del equipo: Equipo 1 */
  //* Autor de la clase: Ramos Bello Jose Luis */
  //* Fecha: 06/02/2026 */
  //**********/

  static async findById(id: number | string) {
    const result = await pool.query(
      `
      SELECT 
        id, id_rol, nombre, apellidos, correo, telefono, 
        foto_perfil, activo, eliminado_en
      FROM "Usuario"
      WHERE id = $1 
        AND activo = true
        AND (eliminado_en IS NULL OR eliminado_en > NOW())
      `,
      [id]
    );
    return result.rows[0] || null;
  }

  static async updateById(id: number | string, data: Partial<{
    nombre?: string;
    apellidos?: string;
    correo?: string;
    contrasena?: string;
    telefono?: string;
    foto_perfil?: string | null;
  }>) {
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

    const query = `
      UPDATE "Usuario"
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
        AND activo = true
        AND (eliminado_en IS NULL OR eliminado_en > NOW())
      RETURNING 
        id, id_rol, nombre, apellidos, correo, telefono, 
        foto_perfil, activo, eliminado_en
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async deactivateById(id: number | string) {
    const result = await pool.query(
      `
      UPDATE "Usuario"
      SET activo = false
          -- , actualizado_en = NOW()   ← si tienes este campo
      WHERE id = $1 
        AND activo = true
      RETURNING id, activo
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  static async deleteById(id: number | string) {
    const result = await pool.query(
      `DELETE FROM "Usuario" WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

}