//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 25/02/2026 */
//**********/
import { AdministradorRepository } from "@/repositories/administrador/administrador.repository";
import { QueryResult } from 'pg';

export class ProductoService {

    //************************************/
    // Lista de Clientes
    //************************************/

    static async listaClientes() {
        const result: QueryResult = await AdministradorRepository.obtenerClientesActivos();
        return result.rows;
    }

    //************************************/
    // Agregar producto
    //************************************/

    static async agregarProducto(data: any) {
        if (data.nombre == null || data.precio == null || data.stock == null) {
            throw new Error("Faltan campos obligatorios: nombre, precio y stock");
        }

        if (data.precio <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }

        if (data.stock < 0) {
            throw new Error("El stock no puede ser negativo");
        }

        const result = await AdministradorRepository.crearProducto(data);
        if (result.rowCount === 0) {
            throw new Error("No se pudo crear el producto");
        }

        return result.rows[0];
    }

    //************************************/
    // Modificar producto
    //************************************/
    static async actualizarProducto(id: number, data: any) {
        if (Object.keys(data).length === 0) {
            throw new Error("No se proporcionaron campos para actualizar");
        }
        if (data.precio !== undefined && data.precio <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }
        if (data.stock !== undefined && data.stock < 0) {
            throw new Error("El stock no puede ser negativo");
        }

        const result: QueryResult = await AdministradorRepository.actualizarProducto(id, data);

        if (result.rowCount === 0) {
            throw new Error("Producto no encontrado o está inactivo");
        }

        return result.rows[0];
    }

    //************************************/
    // Eliminar producto
    //************************************/

    static async eliminarProducto(id: number) {
        const result: QueryResult = await AdministradorRepository.desactivarProducto(id);

        if (result.rowCount === 0) {
            throw new Error("Producto no encontrado o ya está inactivo");
        }

        return { mensaje: "Producto desactivado correctamente", id };
    }
}