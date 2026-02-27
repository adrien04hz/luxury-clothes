//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 27/02/2026 */
//**********/
import { NextResponse } from "next/server";
import { PedidoService } from "@/services/pedido/pedido.service";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = getUserFromToken(req);
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await req.json();

        // Campos esperados
        const { id_metodo_pago, id_direccion, notas } = body;

        if (!id_metodo_pago || !id_direccion) {
            return NextResponse.json(
                { error: "Faltan datos requeridos: método de pago y dirección" },
                { status: 400 }
            );
        }

        // El idCliente viene del usuario autenticado (seguridad)
        const idCliente = user.id;

        const pedidoCreado = await PedidoService.procesarCompra(
            idCliente,
            id_metodo_pago,
            id_direccion,
            notas
        );

        return NextResponse.json(
            {
                success: true,
                message: "Compra procesada correctamente",
                pedido: pedidoCreado,
                id_pedido: pedidoCreado.id,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error al procesar la compra:", error);

        const status = error.message?.includes("carrito está vacío") ||
            error.message?.includes("Stock insuficiente")
            ? 400
            : 500;

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Error al procesar la compra",
            },
            { status }
        );
    }
}