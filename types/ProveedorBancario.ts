export interface ProovedoresBancarios {
    ok: boolean,
    data: Proveedor[]
}

export interface Proveedor {
    id: number,
    nombre: string,
    url: string
}