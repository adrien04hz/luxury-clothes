/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { ColoresResponse } from "@/types/Color";

export const getColores = async (): Promise<ColoresResponse> => {
    return await apiFetch("/colores");
}