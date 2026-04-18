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
            SELECT id, id_usuario, nombre, apellido, telefono, ciudad, estado, codigo_postal, calle, numero_exterior, numero_interior, colonia
            FROM "DireccionEnvio"
            WHERE id_usuario = $1
            ORDER BY id;
        `;

        const { rows } = await pool.query(query, [clientId]);
        return rows;
    }

    //Encontrar solo una direccion de cliente
    static async findByIdAndClientId(
        clientId: number,
        addressId: number
        ) {

        const query = `
            SELECT id, id_usuario, nombre, apellido, telefono, ciudad, estado, codigo_postal,
                calle, numero_exterior, numero_interior, colonia
            FROM "DireccionEnvio"
            WHERE id = $1 AND id_usuario = $2;
        `;

        const { rows } = await pool.query(query, [addressId, clientId]);

        return rows[0]; // puede ser undefined
    }

    static async findDuplicateForCreate(clientId: number, data: any) {
        const query = `
            SELECT 1 FROM "DireccionEnvio"
            WHERE id_usuario = $1
            AND ciudad = $2
            AND estado = $3
            AND codigo_postal = $4
            AND colonia = $5
            AND calle = $6
            AND numero_exterior = $7
            AND numero_interior IS NOT DISTINCT FROM $8
            LIMIT 1;
        `;

        const values = [
            clientId,
            data.nombre,
            data.apellido,
            data.telefono,
            data.ciudad,
            data.estado,
            data.codigo_postal,
            data.colonia,
            data.calle,
            data.numero_exterior,
            data.numero_interior ?? null
        ];

        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    }
    
    //no permitir direcciones duplicadas para un mismo cliente
    static async findDuplicateAddress(clientId: number, addressId: number, data: any){
        const query = `
            SELECT 1 FROM "DireccionEnvio"
            WHERE id_usuario = $1
            AND nombre = $2
            AND apellido = $3
            AND telefono = $4
            AND ciudad = $5
            AND estado = $6
            AND codigo_postal = $7
            AND colonia = $8
            AND calle = $9
            AND numero_exterior = $10
            AND numero_interior is NOT DISTINCT FROM $11 AND id <> $12
        LIMIT 1;
        `;
        const values = [
            clientId,
            data.nombre,
            data.apellido,
            data.telefono,
            data.ciudad,
            data.estado,
            data.codigo_postal,
            data.colonia,
            data.calle,
            data.numero_exterior,
            data.numero_interior ?? null,
            addressId
        ];
        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    }

    //Agregar una nueva dirección de envío para un cliente
    static async addShippingAddress(clientId: number, data: any){
        //Consulta para insertar una direccion nueva
        const query = `
            INSERT INTO "DireccionEnvio" (id_usuario, nombre, apellido, telefono, ciudad, estado, codigo_postal, calle, numero_exterior, numero_interior, colonia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;

        const values = [
            clientId,
            data.nombre,
            data.apellido,
            data.telefono,
            data.ciudad,
            data.estado,
            data.codigo_postal,
            data.calle,
            data.numero_exterior,
            data.numero_interior,
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
            SET nombre=$1,
                apellido=$2,
                telefono=$3,
                estado=$4,
                ciudad=$5,
                codigo_postal=$6,
                colonia=$7,
                calle=$8,
                numero_exterior=$9,
                numero_interior=$10
            WHERE id=$11
            RETURNING *;
        `;

        const values = [
            data.nombre,
            data.apellido,
            data.telefono,
            data.estado,
            data.ciudad,
            data.codigo_postal,
            data.colonia,
            data.calle,
            data.numero_exterior,
            data.numero_interior ?? null,
            id_direccion
        ]

        const { rows } = await pool.query(query, values);
        return rows[0];

    }

    //Eliminar una direccion de envio existente
    static async deleteShippingAddress(clienteId: number, id_direccion: number){

        const query = `
            DELETE FROM "DireccionEnvio"
            WHERE id=$1 AND id_usuario=$2
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