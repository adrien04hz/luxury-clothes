/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { ColorRepository } from '@/repositories/color/color.repository';

export class ColorService {
    /**
     * Obtiene todos los colores utilizando el repositorio de colores.
     * @return Colores obtenidos del repositorio de colores.
     */
    static async getColors() {
        return await ColorRepository.getColors();
    }
}