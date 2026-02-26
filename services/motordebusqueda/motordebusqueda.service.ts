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
    idCategoria?: number;
    idMarca?: number;
    precioMin?: number;
    precioMax?: number;
    soloActivos?: boolean;
    conStock?: boolean;
  }) {

    // recibir parametros
    if (params.precioMin && params.precioMin < 0) {
      throw new Error('El precio mínimo no puede ser negativo');
    }

    if (params.precioMax && params.precioMax < 0) {
      throw new Error('El precio máximo no puede ser negativo');
    }

    if (
      params.precioMin !== undefined &&
      params.precioMax !== undefined &&
      params.precioMin > params.precioMax
    ) {
      throw new Error('El precio mínimo no puede ser mayor al máximo');
    }

    return await FiltroArticulo.filtrar(
      params.palabra ?? null,
      params.idCategoria ?? null,
      params.idMarca ?? null,
      params.precioMin ?? null,
      params.precioMax ?? null,
      params.soloActivos ?? true,
      params.conStock ?? false
    );
  }
}
