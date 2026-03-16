/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

import { apiFetch } from "@/lib/api";
import { Categorias } from "@/types/Categoria";

export const getCategorias = () : Promise<Categorias> => {
    return apiFetch("/categorias");
}