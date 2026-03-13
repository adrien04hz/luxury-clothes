/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 24 de febrero de 2026
 */
import { pool } from "@/lib/db";

// clase principal de metodos de pago
export class MetodoDePagoRepository {

    // ver los metodos de pago disponibles de un cliente en especifico
    static async Ver(id_usuario: number) {
        const { rows } = await pool.query(
            `SELECT * FROM "MetodoDePago"
                WHERE "id_usuario" = $1`,
            [id_usuario]
        );
        return rows;
    }

    // Obtener los tipos de metodo de pago
    // Agregar nuevo metodo
    // 1	Tarjeta de crédito              requiere numero de tarjeta, fecha de vencimiento y nombre titular
    // 2	Tarjeta de débito	            requiere numero de tarjeta, fecha de vencimiento y nombre titular
    // 3	Transferencia bancaria          requiere numero Clave (18 digitos), nombre titular y banco 
    // 4	PayPal                          requiere solo correo
    // 5	Mercado Pago	                requiere correo electronico o ID de usuario de Mercado Pago
    // 6	Apple Pay                       Solo pide verifacion con biometrica ya registradas en el celular 
    // 7	Google Pay	                    Solo pide verifacion con biometrica ya registradas en el celular 
    static async obtenerTipos() {
        const { rows } = await pool.query(
            `SELECT * FROM "TipoMetodoDePago"`
        );
        return rows;
    }
    // obtener los proveedores disponibles
    static async obtenerProveedor() {
        const { rows } = await pool.query(
            `SELECT * FROM "ProveedorBancario"`
        );
        return rows;
    }

    // Obtener el metodo segun id y id_cliente
    static async obtenermetodo(id_usuario: number, id_metodo: number) {
        const { rows } = await pool.query(
            `SELECT * FROM "MetodoDePago"
                WHERE "id_usuario" = $1 AND "id" = $2`,
            [id_usuario, id_metodo]
        );
        return rows[0];
    }
    // agregar metodo de pago 
    static async agregarMetodo(
        id_usuario: number,
        id_tipo_metodo: number,
        numero_cuenta: string | null,
        nombre_titular: string | null,
        fecha_vencimiento: string | null,
        banco: string | null,
        correo: string | null,
        id_proveedor: number) 
        {

        const { rows } = await pool.query(
            `INSERT INTO "MetodoDePago" ("id_usuario", "id_tipo_metodo", "numero_cuenta", "nombre_titular", "fecha_vencimiento", "banco", "correo", "id_proveedor") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [id_usuario, id_tipo_metodo, numero_cuenta, nombre_titular, fecha_vencimiento, banco, correo, id_proveedor]
        );
        return rows[0];
    }

    static async modificarMetodo(
        id_usuario: number,
        id_metodo: number,
        numero_cuenta: string | null,
        nombre_titular: string | null,
        fecha_vencimiento: string | null,
        banco: string | null,
        correo: string | null,
        id_proveedor: number
    ) {
        // solo permitir cambios en el mismo metodo, si quiere un nuevo tipo debe agregar un nuevo metodo
        const { rows } = await pool.query(
            `UPDATE "MetodoDePago" SET 
            "numero_cuenta" = $1, "nombre_titular" = $2, "fecha_vencimiento" = $3, "banco" = $4, "correo" = $5, "id_proveedor" = $6            
            WHERE "id_usuario" = $7 AND "id" = $8
             RETURNING *`,
            [numero_cuenta, nombre_titular, fecha_vencimiento, banco, correo, id_proveedor, id_usuario, id_metodo]
        );

        return rows[0] ?? null;
    }

    static async eliminarMetodo(
        id_usuario: number,
        id_metodo: number) {

        const { rows } = await pool.query(
            `DELETE FROM  "MetodoDePago" 
            WHERE "id_usuario" = $1 AND "id" = $2
             RETURNING *`,
            [id_usuario, id_metodo]
        );
        return rows[0] ?? null
    }
}