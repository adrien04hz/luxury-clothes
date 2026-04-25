import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { id_producto, tallas } = body;

    for (const talla of tallas) {
      await pool.query(
        `UPDATE "StockPorTalla"
         SET stock = $1
         WHERE id_producto = $2 AND id_talla = $3`,
        [talla.stock, id_producto, talla.id_talla]
      );
    }

    return NextResponse.json({ message: "Stock actualizado" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}