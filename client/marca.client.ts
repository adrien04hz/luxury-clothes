/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { MarcaResponse } from "@/types/Marca";

/**
 * Funcion que retorna listado de marcas
 */
export const getMarcas = (): Promise<MarcaResponse> => {
    return apiFetch("/marcas");
}