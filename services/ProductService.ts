/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

// services/ProductService.ts
import { ProductRepository } from '@/repositories/ProductRepository';

export class ProductService {

  static async getCatalog() {
    return ProductRepository.findAll();
  }
}
