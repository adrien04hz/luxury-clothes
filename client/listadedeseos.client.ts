/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 10 de Abril de 2026
 */

import { apiFetch } from "@/lib/api";
import { ListaDeDeseos } from "@/types/listadedeseos/ListaDeDeseos";

export const getWishlist = (
  clientId: number
): Promise<ListaDeDeseos> => {
  return apiFetch(`/listadeseos?clientId=${clientId}`);
};