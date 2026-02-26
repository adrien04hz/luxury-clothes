/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 24 de febrero de 2026
 */
import { NextResponse } from "next/server";
import { MetodoDePagoService } from "@/services/metododepago/metododepago.service";

export async function GET() {
    try {
        const tipos = await MetodoDePagoService.verTipos();
        return NextResponse.json({
            ok: true,
            data: tipos
        });
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: String(error) },
            { status: 500 }
        );
    }
}