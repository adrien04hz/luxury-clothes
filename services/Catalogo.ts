/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { Producto } from '@/repositories/producto/producto.repository';

export class Catalogo {

  static async getCatalog() {
    return Producto.findAll();
  }
}
