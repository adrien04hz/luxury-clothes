/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 16 de marzo de 2026
 */

export interface ProductosResponse {
    ok: boolean;
    count?: number;
    productos: Producto[];
    data : Producto[];

}

export interface DetailResponse {
    ok: boolean;
    data: Producto;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: string;
    color?: string;
    marca: string;
    imagen_url?: string;
    imagenes?: string[];
    stock_por_talla?: Talla[];
}

export interface Talla {
    id: number;
    talla: string;
    stock: number;
}