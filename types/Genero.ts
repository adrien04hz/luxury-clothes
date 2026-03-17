/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

export interface GeneroResponse {
    ok: boolean,
    data: Genero[]
}

export interface Genero {
    id: number,
    nombre: string
}