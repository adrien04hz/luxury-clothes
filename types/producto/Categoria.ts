/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */
export interface Categorias {
    ok: boolean,
    data: Categoria[]
}

export interface Categoria {
    id: number,
    name: string,
    subcategories: Subcategoria[]
}

export interface Subcategoria {
    id: number,
    nombre: string
}