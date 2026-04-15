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
    nombre: string,
    subcategories: Subcategoria[]
}

export interface Subcategoria {
    id: number,
    nombre: string
}

export interface CategoriaPorGenero {
    ok: boolean,
    data: CategoriaPorGeneroItem[]
}

export interface CategoriaPorGeneroItem {
    id_categoria: number,
    categoria: string,
    subcategorias: SubcategoriaPorGenero[]
}

export interface SubcategoriaPorGenero {
    id: number,
    total: number,
    nombre: string
}

export interface CategoriasGeneroGeneral {
    generoId: number,
    categorias: CategoriaPorGeneroItem[]
}