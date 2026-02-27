/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 27 de febrero de 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { MetodoDePagoService } from '@/services/metododepago/metododepago.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clienteId = searchParams.get("clienteId");
        const metodoId = searchParams.get("metodoId");

        if (!clienteId) {
            return NextResponse.json(
                { ok: false, error: "clienteId es requerido" },
                { status: 400 }
            );
        }
        if (!metodoId) {
            return NextResponse.json(
                { ok: false, error: "metodoId es requerido" },
                { status: 400 }
            );
        }

        const id_cliente = Number(clienteId);
        const id_metodo = Number(metodoId);

        if (Number.isNaN(id_cliente)) {
            return NextResponse.json(
                { ok: false, error: "clienteId inválido" },
                { status: 400 }
            );
        }

        if (Number.isNaN(id_metodo)) {
            return NextResponse.json(
                { ok: false, error: "metodoId inválido" },
                { status: 400 }
            );
        }

        const detallemetodos = await MetodoDePagoService.detallesmetodo(id_cliente, id_metodo);

        return NextResponse.json({
            ok: true,
            data: detallemetodos
        });

    } catch (error) {

        console.error("ERROR EN /api/metododepago/metododetalle:", error);
        return NextResponse.json(
            { ok: false, error: "Error interno del servidor" },
            { status: 500 }
        );

    }

}