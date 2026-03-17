/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Endpoint de proveedor bancario
 */

import { NextResponse } from "next/server";
import { ProveedorService } from "@/services/proveedorBancario/proveedorBancario.service";

export async function GET() {
    try {
        const proveedores = await ProveedorService.getProveedoresBancarios();

        if (!proveedores || proveedores.length === 0) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "No se encontraron proveedores bancarios"
                }
            );
        }

        return NextResponse.json(
            {
                ok: true,
                data: proveedores
            }
        );
    } catch (error: any) {
        console.error("ERROR EN /api/proveedorBancario:", error);
        return NextResponse.json(
            {
                ok: false,
                error: error.message || "Error interno del servidor"
            },
            { status: 500 }
        );
    }
}