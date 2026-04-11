/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 */

import { BusquedaArticulo, FiltroArticulo } from "@/repositories/motordebusqueda/motordebusqueda.repository";

// tarea de busqueda de arciculo
export class BusquedaArticuloService {

  static async buscarArticulo(palabra?: string) {
    if (!palabra || palabra.trim() === '') {
      throw new Error('Palabra requerida'); //debe regresar error
    }

    return BusquedaArticulo.buscar(palabra.trim());
  }
}

// tarea de filtro de articulos
export class FiltroArticuloService {

  static async filtrar(params: {
    palabra?: string;
    idCategoria?: number | null;
    idMarca?: number | null;
    idGenero?: number | null;
    idColor?: number | null;
    precioMin?: number | null;
    precioMax?: number | null;
    orden?: string;
    soloActivos?: boolean;
    conStock?: boolean;
  }) {

    // recibir parametros
    const min = params.precioMin;
    const max = params.precioMax;

    if (min != null && min < 0) {
      throw new Error('El precio mínimo no puede ser negativo');
    }

    if (max != null && max < 0) {
      throw new Error('El precio máximo no puede ser negativo');
    }

    if (min != null && max != null && min > max) {
      throw new Error('El precio mínimo no puede ser mayor al máximo');
    }
    return await FiltroArticulo.filtrar(
      params.palabra ?? null,
      params.idCategoria ?? null,
      params.idMarca ?? null,
      params.idGenero ?? null,
      params.idColor ?? null,
      params.precioMin ?? null,
      params.precioMax ?? null,
      params.orden ?? null,
      params.soloActivos ?? true,
      params.conStock ?? false
    );
  }
}
