export interface ProovedoresBancarios {
    ok: boolean,
    data: Proveedor[]
}

interface Proveedor {
    id: number,
    nombre: string,
    url: string
}