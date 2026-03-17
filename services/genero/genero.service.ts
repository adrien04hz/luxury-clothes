/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { GeneroRepository } from "@/repositories/genero/genero.repository";

export class GeneroService {
    /**
     * Servicio para obtener generos de la base de datos
     * @return Lista de generos de la base de datos
     */
    static async getGenres() {
        return await GeneroRepository.getGeneros();
    }
}