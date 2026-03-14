//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 09/03/2026 */
//**********/
import { AdministradorRepository } from "@/repositories/administrador/administrador.repository";
import { QueryResult } from 'pg';

export class ProductoService {
  static async listaClientes() {
    const result: QueryResult = await AdministradorRepository.obtenerClientesActivos();
    return result.rows;
  }

  static async agregarProducto(data: any) {
    const requiredFields = [
      'nombre', 'descripcion', 'precio',
      'id_color', 'id_genero', 'id_subcategoria', 'id_marca'
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`Faltan campos obligatorios: ${requiredFields.join(', ')}`);
      }
    }

    if (typeof data.precio !== 'number' || data.precio <= 0) {
      throw new Error("El precio debe ser un número mayor a 0");
    }

    const result = await AdministradorRepository.crearProducto(data);

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
}