/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { NextResponse } from "next/server";
import { ColorService } from "@/services/color/color.service";

export async function GET() {
    try {
        const colors = await ColorService.getColors();

        if (!colors || colors.length === 0) {
            return NextResponse.json({ ok: false, message: "No se encontraron colores" });
        }

        return NextResponse.json({
            ok: true,
            data: colors,
        });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error al obtener los colores" });
    }
}