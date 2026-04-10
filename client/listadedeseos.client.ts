/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 10 de Abril de 2026
 */

import { apiFetch } from "@/lib/api";
import { WishlistResponse } from "@/types/listadedeseos/ListaDeDeseos";

export const getWishlist = (
  clientId: number): Promise<WishlistResponse> => {
  return apiFetch(`/listadeseos?clientId=${clientId}`);
};