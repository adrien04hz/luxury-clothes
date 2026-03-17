/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Servicio de proveedor bancario
 */

import { ProveedorRepository } from "@/repositories/proveedorBancario/proveedorBancario.repository";

export class ProveedorService {
    /**
     * Obtener proveedores bancarios
     * @returns Lista de proveedores bancarios
     */
    static async getProveedoresBancarios() {
        return await ProveedorRepository.getProveedoresBancarios();
    }
}