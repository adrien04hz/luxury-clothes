/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 19 de febrero de 2026
 */

import { DireccionEnvio } from "@/repositories/direcciondeenvio/direcciondeenvio.repository";

export class DireccionesEnvio{
    
    //Reglas de negocio para las direcciones de envío
    //1. no permitir direcciones duplicadas para un mismo cliente
    static async addAddress(clientId: number, addressId: number, data: any){

        const duplicate = await DireccionEnvio.findDuplicateAddress(clientId, addressId, data);

        if(duplicate){
            throw new Error("Duplicate address for the same client is not allowed");
        } 
        
        return await DireccionEnvio.addShippingAddress(clientId, data);

    }

    static async updateAddress(clientId: number, addressId: number, data: any){
        //Primero verificamos que la dirección exista y pertenezca al cliente
        const addresses = await DireccionEnvio.findByUserId(clientId);
        const address = addresses.find((addr: any) => addr.id === addressId);

        if(!address){
            throw new Error("Address not found for the given client");
        }

        //Luego verificamos que la nueva dirección no sea un duplicado
        const duplicate = await DireccionEnvio.findDuplicateAddress(clientId,addressId,  data);

        if(duplicate){
            throw new Error("Duplicate address for the same client is not allowed");
        }

        //Si todo marcha bien, actualizamos la dirección
        return await DireccionEnvio.updateShippingAddress(addressId, data);
    }

    static async deleteAddress(clientId: number, addressId: number){
        //Primero verificamos que la dirección exista y pertenezca al cliente
        const addresses = await DireccionEnvio.findByUserId(clientId);
        const address = addresses.find((addr: any) => addr.id === addressId);

        if(!address){
            throw new Error("Address not found for the given client");
        }

        //Si todo marcha bien, eliminamos la dirección
        return await DireccionEnvio.deleteShippingAddress(clientId, addressId);

    }

    static async getAddress(clientId: number){
        //Obtenemos las direcciones de envío del cliente
        const rows = await DireccionEnvio.findByUserId(clientId);

        //Si no se encuentra nada, mandamos vacio
        if (rows.length === 0) {
            return {
            id_cliente: clientId,
            direcciones: []
            };
        }

        //Reestructuramos la informacion que se mando
        return{
            id_cliente: rows[0].id_cliente,
            direcciones: rows.map((row: any) => ({
            ciudad: row.ciudad,
            estado: row.estado,
            codigo_postal: row.codigo_postal,
            calle: row.calle,
            numero_externo: row.numero_externo,
            numero_interno: row.numero_interno,
            colonia: row.colonia
            }))
        };
    }
}