/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { pool } from '@/lib/db';

export class ProductRepository {

  static async findAll() {
    const { rows } = await pool.query(
      `
      SELECT id, name, price, stock, marca
      FROM Producto as P, Marca as M
      WHERE P.marca_id = M.id
      ORDER BY id
      `
    );

    return rows;
  }
}
