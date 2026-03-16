/**
 * Adrien Hernandez Sanchez
 * 2026-03-16
 * Servicio de marcas
 */

import { Marca } from "@/repositories/marca/marcas.repository";

export class MarcaService {
    /**
     * Funcion para obtener todas las marcas
     * @returns Lista de marcas
     */
    static async getMarcas() {
        return await Marca.obtenerMarcas();
    }
}