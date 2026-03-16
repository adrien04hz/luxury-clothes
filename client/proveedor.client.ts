/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { ProovedoresBancarios } from "@/types/ProveedorBancario";

export const getProveedoresBancarios = () : Promise<ProovedoresBancarios> => {
    return apiFetch("/proveedorBancario");
}