//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 23/02/2026 */
//**********/
import { pool } from "@/lib/db";

export class pedido_repositories {

//************************************/
// Cancelar pedido
//************************************/

  static async cancelarPedido(id: number) {
  const result = await pool.query(
    `UPDATE "Pedido"
     SET estado = 'cancelado',
     WHERE id = $1 
       AND estado NOT IN ('cancelado', 'entregado', 'en proceso')
     RETURNING id, estado`,
    [id]
  );
  if (result.rowCount === 0) {
    return {
      success: false,
      message: "El pedido no existe o no se puede cancelar en su estado actual"
    };
  }
  return {
    success: true,
    pedidoId: result.rows[0].id,
    nuevoEstado: result.rows[0].estado
  };
}

//************************************/
// Estado de pedido
//************************************/

  static async estadoPedido(id: number) {
    return pool.query(
      `SELECT estado FROM "Pedido"
       WHERE id = $1`,
      [id]
    );
  }

//************************************/
// Proceso de compra de pedido
//************************************/







}