/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 27 de febrero de 2026
 */

import { NextResponse } from "next/server";
import { MetodoDePagoService } from "@/services/metododepago/metododepago.service";

export async function POST(req: Request) {
    try {

        const body = await req.json();
        const { id_cliente, id_tipo, id_metodo, numero_cuenta, nombre_titular, fecha_vencimiento, banco, correo, proveedor } = body;

        if (!id_cliente) {
            return NextResponse.json(
                { ok: false, error: "id_cliente requerido" },
                { status: 400 }
            );
        }
        if (!id_metodo) {
            return NextResponse.json(
                { ok: false, error: "id_metodo requerido" },
                { status: 400 }
            );
        }

        const nuevoMetodo = await MetodoDePagoService.modificarMetodo(
            Number(id_cliente),
            Number(id_tipo),
            Number(id_metodo),
            numero_cuenta ?? null,
            nombre_titular ?? null,
            fecha_vencimiento ?? null,
            banco ?? null,
            correo ?? null,
            proveedor ?? null
        );

        return NextResponse.json(
            {
                ok: true,
                message: "Método de pago modificado correctamente",
                data: nuevoMetodo
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("ERROR EN /api/metododepago/modificar:", error);
        return NextResponse.json(
            {
                ok: false,
                error: error.message || "Error interno del servidor"
            },
            { status: 500 }
        );
    }
}