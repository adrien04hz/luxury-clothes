/**
 * Adrien Hernández Sánchez
 * 2026-04-09
 * Equipo 1
 */
import { NextResponse } from "next/server";
import { LogisticaService } from "@/services/logistica/logistica.service";

/**
 * Endpoint para actualizar estado de envio del pedido
 * @author Adrien Hernández Sánchez
 * @param request - Objeto de solicitud HTTP que contiene:
 * idPedido: ID del pedido a actualizar
 * idNuevoEstado: Nuevo estado del pedido
 * idUsuarioLogistica: ID del usuario que realiza la actualización
 */
export async function POST(request: Request) {
    try {
        const { idPedido, idNuevoEstado, idUsuarioLogistica } = await request.json();

        if (!idPedido || !idNuevoEstado || !idUsuarioLogistica) {
            return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
        }

        const resultado = await LogisticaService.actualizarEstadoEnvio(idPedido!, idNuevoEstado!, idUsuarioLogistica!);
        return NextResponse.json({
            ok: true,
            resultado: resultado
        });

    } catch (error) {
        console.error("Error al actualizar el estado del envío:", error);
        return NextResponse.json({ error: "Error al actualizar el estado del envío" }, { status: 500 });
    }
}