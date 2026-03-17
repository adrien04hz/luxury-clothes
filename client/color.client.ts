/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { ColoresResponse } from "@/types/Color";

/**
 * Funcion que retorna listados
 * de colores del sistema
 */
export const getColores = (): Promise<ColoresResponse> => {
    return apiFetch("/colores");
}