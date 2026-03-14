//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 13/03/2026 */
//**********/
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

interface ProductoInput {
  nombre: string;
  descripcion: string;
  precio: number;
  id_color: number;
  id_genero: number;
  id_subcategoria: number;
  id_marca: number;
  activo?: boolean;
}

export class AdministradorRepository {
  static async desactivarProducto(id: number): Promise<QueryResult> {
    return pool.query(
      `UPDATE "Producto"
       SET activo = false
       WHERE id = $1 AND activo = true
       RETURNING id, nombre, activo`,
      [id]
    );
  }

  static async crearProducto(data: ProductoInput): Promise<QueryResult> {
    const {
      nombre,
      descripcion,
      precio,
      id_color,
      id_genero,
      id_subcategoria,
      id_marca,
      activo = true,
    } = data;

    return pool.query(
      `INSERT INTO "Producto" (
         nombre, descripcion, precio,
         id_color, id_genero, id_subcategoria, id_marca, activo
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nombre, descripcion, precio,
                 id_color, id_genero, id_subcategoria, id_marca, activo`,
      [nombre, descripcion, precio, id_color, id_genero, id_subcategoria, id_marca, activo]
    );
  }

  static async actualizarProducto(id: number, data: Partial<ProductoInput>): Promise<QueryResult> {
    if (Object.keys(data).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const mappings: Record<string, string> = {
      nombre: 'nombre',
      descripcion: 'descripcion',
      precio: 'precio',
      id_color: 'id_color',
      id_genero: 'id_genero',
      id_subcategoria: 'id_subcategoria',
      id_marca: 'id_marca',
      activo: 'activo'
    };

    for (const [key, dbField] of Object.entries(mappings)) {
      if (data[key as keyof ProductoInput] !== undefined) {
        fields.push(`${dbField} = $${paramIndex++}`);
        values.push(data[key as keyof ProductoInput]);
      }
    }

    if (fields.length === 0) {
      throw new Error("No hay campos válidos para actualizar");
    }

    values.push(id);

    const query = `
      UPDATE "Producto"
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND activo = true
      RETURNING id, nombre, descripcion, precio,
                id_color, id_genero, id_subcategoria, id_marca, activo
    `;

    return pool.query(query, values);
  }

  static async obtenerClientesActivos(): Promise<QueryResult> {
    return pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.apellidos, 
        u.correo, 
        u.telefono,
        u.foto_perfil
      FROM "Usuario" u
      JOIN "Rol" r ON u.id_rol = r.id
      WHERE u.activo = true 
        AND r.nombre = 'cliente'
      ORDER BY u.nombre, u.apellidos ASC
    `);
  }

  static async obtenerHistorialVentas(): Promise<QueryResult> {
    return pool.query(`
      SELECT 
        p.id AS id_producto,
        p.nombre AS nombre_producto,
        t.nombre AS talla,
        SUM(dp.cantidad) AS cantidad_total_vendida,
        COUNT(DISTINCT dp.id_pedido) AS numero_pedidos,
        ROUND(AVG(dp.precio_unitario), 2) AS precio_promedio
      FROM "DetallePedido" dp
      JOIN "Producto" p ON dp.id_producto = p.id
      JOIN "Talla" t ON dp.id_talla = t.id
      JOIN "Pedido" ped ON dp.id_pedido = ped.id
      JOIN "EstadoPedido" ep ON ped.id_estado_pedido = ep.id
      WHERE ep.nombre NOT ILIKE '%cancelado%'
        AND ep.nombre NOT ILIKE '%rechazado%'
      GROUP BY p.id, p.nombre, t.id, t.nombre
      ORDER BY cantidad_total_vendida DESC, p.nombre, t.nombre
    `);
  }

  static async obtenerStockProducto(idProducto: number): Promise<QueryResult> {
    return pool.query(`
      SELECT 
        t.nombre AS talla,
        s.stock,
        t.id AS id_talla
      FROM "StockPorTalla" s
      JOIN "Talla" t ON s.id_talla = t.id
      WHERE s.id_producto = $1
      ORDER BY t.nombre
    `, [idProducto]);
  }
}