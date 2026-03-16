/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { MarcaResponse } from "@/types/Marca";

export const getMarcas = async (): Promise<MarcaResponse> => {
    return await apiFetch("/marcas");
}