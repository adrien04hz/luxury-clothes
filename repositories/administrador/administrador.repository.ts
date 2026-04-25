//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 20/04/2026 */
//**********/
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

interface ProductoInput {
  nombre: string;
  descripcion: string;
  precio: number;
  id_color?: number; 
  id_genero?: number;
  id_subcategoria?: number;
  id_marca?: number;
  activo?: boolean;
}

export class AdministradorRepository {

    // ==================== LISTAR PRODUCTOS CON IMÁGENES ====================
  static async obtenerProductos(): Promise<QueryResult> {
    return pool.query(`
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.activo,
        COALESCE(SUM(s.stock), 0) AS stock,
        c.nombre AS color,
        g.nombre AS genero,
        sc.nombre AS subcategoria,
        m.nombre AS marca,
        ARRAY_AGG(DISTINCT ip.url) FILTER (WHERE ip.url IS NOT NULL) AS imagenes
      FROM "Producto" p
      LEFT JOIN "StockPorTalla" s ON p.id = s.id_producto
      LEFT JOIN "Color" c ON p.id_color = c.id
      LEFT JOIN "Genero" g ON p.id_genero = g.id
      LEFT JOIN "Subcategoria" sc ON p.id_subcategoria = sc.id
      LEFT JOIN "Marca" m ON p.id_marca = m.id
      LEFT JOIN "ImagenProducto" ip ON p.id = ip.id_producto
      GROUP BY 
        p.id, p.nombre, p.descripcion, p.precio, p.activo,
        c.nombre, g.nombre, sc.nombre, m.nombre
      ORDER BY p.id DESC
    `);
  }

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
      id_color = 1,      // valor por defecto
      id_genero = 1,
      id_subcategoria = 1,
      id_marca = 1,
      activo = true,
    } = data;

    return pool.query(
      `INSERT INTO "Producto" (
         nombre, descripcion, precio,
         id_color, id_genero, id_subcategoria, id_marca, activo
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nombre, descripcion, precio, activo`,
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
      WHERE id = $${paramIndex}
      RETURNING id, nombre, descripcion, precio, activo
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
        u.foto_perfil,
        u.activo
      FROM "Usuario" u
      JOIN "Rol" r ON u.id_rol = r.id
      WHERE u.activo = true 
        AND r.id = 1
      ORDER BY u.nombre, u.apellidos ASC
    `);
  }

  static async obtenerHistorialVentas(): Promise<QueryResult> {
    return pool.query(`
      SELECT 
        p.id AS id,
        p.fecha,
        p.total,
        ep.nombre AS estado,
        u.nombre || ' ' || u.apellidos AS cliente
      FROM "Pedido" p
      JOIN "EstadoPedido" ep ON ep.id = p.id_estado_pedido
      JOIN "Usuario" u ON u.id = p.id_usuario
      ORDER BY p.id ASC;
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
  static async obtenerVentasTotales() {
    return pool.query(`
      SELECT SUM(total) as total_ventas
      FROM "Pedido"
      WHERE "id_estado_pedido" = 5;
    `);
  }
  static async obtenerUsuariosActivos() {
    return pool.query(`
      SELECT COUNT(*) as usuarios_activos
      FROM "Usuario"
      WHERE "activo" = true;
    `);
  }
  static async obtenerUsuariosRecientes() {
    return pool.query(`
      SELECT id, nombre, correo
      FROM "Usuario"
      ORDER BY "id" DESC
      LIMIT 5;
    `);
  }
  static async obtenerTopProductos() {
    return pool.query(`
      SELECT 
        p.id,
        p.nombre,
        SUM(dp.cantidad) as total_vendidos
        FROM "DetallePedido" dp
      INNER JOIN "Producto" p ON p.id = dp.id_producto
      GROUP BY p.id, p.nombre
      ORDER BY total_vendidos DESC
      LIMIT 5;
    `);
  }
}