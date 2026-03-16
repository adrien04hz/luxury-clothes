import { NextResponse } from "next/server";
import { MarcaService } from "@/services/marca/marca.service";

export async function GET() {
    try {
        const marcas = await MarcaService.getMarcas();
        return NextResponse.json(
            {
                ok: true,
                data: marcas
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("ERROR EN /api/marcas:", error);
        return NextResponse.json(
            {
                ok: false,
                error: error.message || "Error interno del servidor"
            },
            { status: 500 }
        );
    }
}