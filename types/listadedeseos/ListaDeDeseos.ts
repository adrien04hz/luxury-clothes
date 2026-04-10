/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 16 de marzo de 2026
 */
export interface ListaDeDeseos {
  id: number;
  nombre: string;
  precio: string;
  marca: string;
  imagenes: string[];
}

export interface WishlistResponse {
  ok: boolean;
  count: number;
  data: ListaDeDeseos[];
}