import { NextResponse } from "next/server";
import { MetodoDePagoService } from "@/services/metododepago/metododepago.service";

export async function DELETE(req: Request) {
    try {

        const body = await req.json();

        const { id_cliente, id_metodo } = body;

        const metodo = await MetodoDePagoService.eliminarMetodo(
            id_cliente,
            id_metodo
        );

        return NextResponse.json({
            ok: true,
            message: "Método de pago eliminado correctamente",
            data: metodo
        });

    } catch (error: any) {
        console.error("ERROR EN /api/metododepago/eliminar:", error);
        return NextResponse.json(
            {
                ok: false,
                error: error.message
            },
            { status: 400 }
        );

    }
}