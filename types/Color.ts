/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

export interface ColoresResponse {
    ok: boolean;
    data: Color[];
}

export interface Color {
    id: number;
    nombre: string;
}