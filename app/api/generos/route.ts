/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { NextResponse } from "next/server";
import { GeneroService } from "@/services/genero/genero.service";

/**
 * Endpoint para obtener los generos
 * de la base de datos
 * @return Lista con generos de la base de datos
 */
export async function GET() {
    try {
        const generos = await GeneroService.getGenres();

        if (!generos || generos.length === 0) {
            return NextResponse.json({ ok: false, message: "No se encontraron generos" });
        }

        return NextResponse.json({
            ok: true,
            data: generos,
        });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error al obtener los generos" });
    }
}