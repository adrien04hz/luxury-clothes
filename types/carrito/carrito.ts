export interface CarritoResponse {
    ok: boolean;
    count: number;
    data: CarritoItem[];
}

export interface CarritoItem {
    id_producto: number;
    nombre: string;
    precio: number;
    talla: string;
    cantidad: number;
    genero: string;
    color: string;
    imagen: string;
    id_talla: number;
}