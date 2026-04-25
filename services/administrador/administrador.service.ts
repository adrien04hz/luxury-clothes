//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 20/04/2026 */
//**********/
import { AdministradorRepository } from "@/repositories/administrador/administrador.repository";
import { QueryResult } from 'pg';

export class ProductoService {

  static async listaProductos() {
    try {
      const result: QueryResult = await AdministradorRepository.obtenerProductos();
      return result.rows;
    } catch (error: any) {
      throw new Error(error.message || "Error al obtener lista de productos");
    }
  }

  static async listaClientes() {
    const result: QueryResult = await AdministradorRepository.obtenerClientesActivos();
    return result.rows;
  }

  static async agregarProducto(data: any) {
    // Solo validamos los campos que realmente vienen del formulario
    if (!data.nombre || !data.descripcion) {
      throw new Error("Nombre y descripción son obligatorios");
    }
    if (typeof data.precio !== 'number' || data.precio <= 0) {
      throw new Error("El precio debe ser un número mayor a 0");
    }

    const productoData = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      id_color: data.id_color || 1,
      id_genero: data.id_genero || 1,
      id_subcategoria: data.id_subcategoria || 1,
      id_marca: data.id_marca || 1,
    };

    const result = await AdministradorRepository.crearProducto(productoData);

    if (result.rowCount === 0) {
      throw new Error("No se pudo crear el producto");
    }

    return result.rows[0];
  }

  static async actualizarProducto(id: number, data: any) {
    if (Object.keys(data).length === 0) {
      throw new Error("No se proporcionaron campos para actualizar");
    }

    if (data.precio !== undefined) {
      if (typeof data.precio !== 'number' || data.precio <= 0) {
        throw new Error("El precio debe ser un número mayor a 0");
      }
    }

    const result: QueryResult = await AdministradorRepository.actualizarProducto(id, data);

    if (result.rowCount === 0) {
      throw new Error("Producto no encontrado o está inactivo");
    }

    return result.rows[0];
  }

  static async eliminarProducto(id: number) {
    const result: QueryResult = await AdministradorRepository.desactivarProducto(id);

    if (result.rowCount === 0) {
      throw new Error("Producto no encontrado o ya está inactivo");
    }

    return {
      mensaje: "Producto desactivado correctamente",
      id
    };
  }

  // Métodos existentes que no tocamos
  static async obtenerHistorialVentas() {
    try {
      const result: QueryResult = await AdministradorRepository.obtenerHistorialVentas();
      return result.rows;
    } catch (error: any) {
      throw new Error(error.message || "Error al obtener el historial de ventas");
    }
  }

  static async obtenerStockProducto(id: number) {
    const result = await AdministradorRepository.obtenerStockProducto(id);
    return result.rows;
  }
  static async obtenerVentasTotales() {
    const result = await AdministradorRepository.obtenerVentasTotales();
    return result.rows[0]?.total_ventas || 0;
  }
  static async obtenerUsuariosActivos() {
    const result = await AdministradorRepository.obtenerUsuariosActivos();
    return result.rows[0]?.usuarios_activos || 0;
  }
  static async obtenerUsuariosRecientes() {
    const result = await AdministradorRepository.obtenerUsuariosRecientes();
    return result.rows;
  }
  static async obtenerTopProductos() {
    const result = await AdministradorRepository.obtenerTopProductos();
    return result.rows;
  }
  static async obtenerDashboard() {
    const [
      ventasRes,
      activosRes,
      recientesRes,
      topRes
    ] = await Promise.all([
      AdministradorRepository.obtenerVentasTotales(),
      AdministradorRepository.obtenerUsuariosActivos(),
      AdministradorRepository.obtenerUsuariosRecientes(),
      AdministradorRepository.obtenerTopProductos()
    ]);

    return {
      ventas: ventasRes.rows[0]?.total_ventas || 0,
      usuariosActivos: activosRes.rows[0]?.usuarios_activos || 0,
      usuariosRecientes: recientesRes.rows,
      topProductos: topRes.rows
    };
  }
}