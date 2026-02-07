//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 06/02/2026 */
//**********/
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getUserFromToken(req: Request | NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      correo: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}