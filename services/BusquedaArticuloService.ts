/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 */

import { BusquedaArticulo } from '@/repositories/BusquedaArticulo';

export class BusquedaArticuloService {

  static async buscarArticulo(palabra?: string) {
    if (!palabra || palabra.trim() === '') {
      throw new Error('Palabra requerida'); //debe regresar error
    }

    return BusquedaArticulo.buscar(palabra.trim());
  }
}
