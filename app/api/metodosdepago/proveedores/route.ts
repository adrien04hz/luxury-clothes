/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 12 de marzo de 2026
 */
import { NextResponse } from "next/server";
import { MetodoDePagoService } from "@/services/metododepago/metododepago.service";

export async function GET() {
    try {
        const tipos = await MetodoDePagoService.verProveedor();
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