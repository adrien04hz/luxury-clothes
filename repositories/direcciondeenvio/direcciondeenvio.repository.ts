/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 17 de febrero de 2026
 */

import { pool } from '@/lib/db';


export class DireccionEnvio {
    //Encontrar las direcciones de envío de un cliente
    static async findByUserId(clientId: number){
        //Consulta para obtener la lista de direcciones
        const query = `
            SELECT id,id_cliente, ciudad, estado, codigo_postal, calle, numero_externo, numero_interno, colonia
            FROM "DireccionEnvio"
            WHERE id_cliente = $1
            ORDER BY id;
        `;

        const { rows } = await pool.query(query, [clientId]);
        return rows;
    }

    //no permitir direcciones duplicadas para un mismo cliente
    static async findDuplicateAddress(clientId: number, addressId: number, data: any){
        const query = `
            SELECT 1 FROM "DireccionEnvio"
            WHERE id_cliente = $1
            AND ciudad = $2
            AND estado = $3
            AND codigo_postal = $4
            AND colonia = $5
            AND calle = $6
            AND numero_externo = $7
            AND numero_interno is NOT DISTINCT FROM $8 AND id <> $9
        LIMIT 1;
        `;
        const values = [
            clientId,
            data.ciudad,
            data.estado,
            data.codigo_postal,
            data.colonia,
            data.calle,
            data.numero_externo,
            data.numero_interno ?? null,
            addressId
        ];
        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    }

    //Agregar una nueva dirección de envío para un cliente
    static async addShippingAddress(clientId: number, data: any){
        //Consulta para insertar una direccion nueva
        const query = `
            INSERT INTO "DireccionEnvio" (id_cliente, ciudad, estado, codigo_postal, calle, numero_externo, numero_interno, colonia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            clientId,
            data.ciudad,
            data.estado,
            data.codigo_postal,
            data.calle,
            data.numero_externo,
            data.numero_interno,
            data.colonia
        ]
        
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    //Modificar una direccion existente del usuario
    static async updateShippingAddress(id_direccion: number, data: any){

        //Consulta para modificar direccion
        const query = `
            UPDATE "DireccionEnvio"
            SET estado=$1,
                ciudad=$2,
                codigo_postal=$3,
                colonia=$4,
                calle=$5,
                numero_externo=$6,
                numero_interno=$7
            WHERE id=$8
            RETURNING *;
        `;

        const values = [
            data.estado,
            data.ciudad,
            data.codigo_postal,
            data.colonia,
            data.calle,
            data.numero_externo,
            data.numero_interno ?? null,
            id_direccion
        ]

        const { rows } = await pool.query(query, values);
        return rows[0];

    }

    //Eliminar una direccion de envio existente
    static async deleteShippingAddress(clienteId: number, id_direccion: number){

        const query = `
            DELETE FROM "DireccionEnvio"
            WHERE id=$1 AND id_cliente=$2
            RETURNING *;
        `;
        const values = [id_direccion, clienteId];
        const { rowCount, rows } = await pool.query(query, values);

        if(rowCount === 0){
            throw new Error("Address not found for the client. Deletion failed.");
        }

        return rows[0];
    }
    
}