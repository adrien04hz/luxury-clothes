/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

export interface MarcaResponse {
    ok: boolean,
    data: Marca[]
}

export interface Marca {
    id: number,
    nombre: string,
    imagen_url: string
}