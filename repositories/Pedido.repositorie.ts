//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 23/02/2026 */
//**********/
import { pool } from '@/lib/db';
import { QueryResult } from 'pg';

export class PedidoRepository {

  //************************************/
  // Cancelacion de pedido
  //************************************/

  static async cancelarPedido(id: number): Promise<QueryResult> {
    return pool.query(
      `UPDATE "Pedido"
       SET estado = 'cancelado',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 
         AND estado NOT IN ('cancelado', 'entregado', 'en proceso')
       RETURNING id, estado, updated_at`,
      [id]
    );
  }

  //************************************/
  // Estado de pedido
  //************************************/

  static async estadoPedido(id: number): Promise<QueryResult> {
    return pool.query(
      `SELECT id, estado, fecha_pedido, total, updated_at
       FROM "Pedido"
       WHERE id = $1`,
      [id]
    );
  }
}