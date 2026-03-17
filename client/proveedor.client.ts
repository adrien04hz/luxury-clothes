/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { ProovedoresBancarios } from "@/types/ProveedorBancario";


/**
 * Obtiene la lista de proveedores bancarios
 * @returns Lista de proveedores bancarios
 */
export const getProveedoresBancarios = () : Promise<ProovedoresBancarios> => {
    return apiFetch("/proveedorBancario");
}