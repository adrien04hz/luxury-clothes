/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 24 de febrero de 2026
 */
import { MetodoDePagoRepository } from "@/repositories/metododepago/metododepago.repository";

// clase principal de metodos de pago
export class MetodoDePagoService {

    // ver los metodos de pago disponibles
    static async VerMetodos(id_cliente: number) {
        const metodos = await MetodoDePagoRepository.Ver(id_cliente);
        return metodos;
    }

    //Ver los tipos de metodos de pago
    static async verTipos() {
        return await MetodoDePagoRepository.obtenerTipos();
    }

    //Agregar nuevos metodos de pago
    static async agregarMetodo(
        id_cliente: number,
        id_tipo: number,
        numero_cuenta: string | null,
        nombre_titular: string | null,
        fecha_vencimiento: string | null,
        banco: string | null,
        correo: string | null,
        proveedor: string | null) {

        // validar que cliente
        if (!id_cliente)
            throw new Error("Cliente requerido");

        //validar tipo de pago

        const validos = [1, 2, 3, 4, 5, 6, 7];

        if (!validos.includes(id_tipo))
            throw new Error("Tipo requerido");

        // consultar los metodos de pago del cliente
        const metodos = await this.VerMetodos(id_cliente);
        const limite = metodos?.length ?? 0;

        // limitar a solo 5 metodos de pago
        if (limite >= 5)
            throw new Error("El cliente ya tiene el máximo de 5 métodos de pago");

        // validar todos los parametros

        // evitar duplicar el mismo metodo de pago
        const duplicado = metodos.some(m =>
            (numero_cuenta && m.numero_cuenta === numero_cuenta) ||
            (correo && m.correo === correo)
        );

        if (duplicado)
            throw new Error("Este método de pago ya está registrado");

        // realizar insercion si pasa los filtros
        const metodo = await MetodoDePagoRepository.agregarMetodo(
            id_cliente,
            id_tipo,
            numero_cuenta,
            nombre_titular,
            fecha_vencimiento,
            banco,
            correo,
            proveedor
        );
        return metodo;
    }


    static async eliminarMetodo(
        id_cliente: number,
        id_metodo: number) {

        if (!id_cliente)
            throw new Error("Cliente requerido");

        if (!id_metodo)
            throw new Error("Metodo requerido");

        const metodo = await MetodoDePagoRepository.eliminarMetodo(id_cliente, id_metodo);

        if (!metodo)
            throw new Error("Metodo de pago no encontrado");

        return metodo;
    }
}
