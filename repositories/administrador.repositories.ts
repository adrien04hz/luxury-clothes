//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 23/02/2026 */
//**********/

interface Producto {
  nombre?: string;
  precio?: number;
  stock?: number;
  estaActivo?: boolean;
  marca?: string;
  categorias?: string[] | number[] | null;
}

import { pool } from '@/lib/db';

export class administrador_repositories {

  //************************************/
  // Eliminar producto del catálogo
  //************************************/

  static async EliminarProducto(id: number) {
    const resultado = await pool.query(
      `UPDATE "Producto"
       SET estaActivo = false
       WHERE id = $1 AND estaActivo = true
       RETURNING id`,
      [id]
    );
    if (resultado.rowCount === 0) {
      return { success: false, message: "Producto no encontrado o ya está inactivo" };
    }
    return { success: true, id: resultado.rows[0].id };
  }

  //************************************/
  // Agregar producto del catálogo
  //************************************/

  static async agregarProducto(data: Producto) {
    const {
      nombre,
      precio,
      stock,
      estaActivo = true,
      marca = null,
      categorias,
    } = data;
    const result = await pool.query(
      `INSERT INTO "Producto" (nombre, precio, stock, activo, marca, categorias)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nombre, precio, stock, activo, marca, categorias`,
      [nombre, precio, stock, estaActivo, marca, categorias]
    );
    return result.rows[0];
  }

  //************************************/
  // Modificar un producto del catálogo
  //************************************/

  static async actualizarProducto(id: number, data: Producto) {
    if (Object.keys(data).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (data.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex}`);
      values.push(data.nombre);
      paramIndex++;
    }
    if (data.precio !== undefined) {
      fields.push(`precio = $${paramIndex}`);
      values.push(data.precio);
      paramIndex++;
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramIndex}`);
      values.push(data.stock);
      paramIndex++;
    }
    if (data.estaActivo !== undefined) {
      fields.push(`estaActivo = $${paramIndex}`);
      values.push(data.estaActivo);
      paramIndex++;
    }
    if (data.marca !== undefined) {
      fields.push(`marca = $${paramIndex}`);
      values.push(data.marca);
      paramIndex++;
    }

    if (data.categorias !== undefined) {
      fields.push(`categorias = $${paramIndex}`);
      values.push(data.categorias);
      paramIndex++;
    }
    values.push(id);
    const query = `
    UPDATE "Producto"
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex} AND estaActivo = true
    RETURNING id, nombre, precio, stock, estaActivo, marca, categorias`;
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return { success: false, message: "Producto no encontrado o inactivo" };
    }
    return { success: true, producto: result.rows[0] };
  }

  //************************************/
  // Lista de clientes
  //************************************/

  static async ListaClientes() {
    const resultado = await pool.query(
      `SELECT id, nombre FROM "Cliente"
       WHERE estaActivo = true
       ORDER BY nombre ASC`,
    );
    return resultado.rows;
  }
}
