export interface FiltroV2Response {
    ok:   boolean;
    data: Data;
}

export interface Data {
    id_categoria: number;
    categoria:    string;
    total:        string;
    cantidades:   Cantidades;
}

export interface Cantidades {
    subcategorias: Subcategoria[];
    generos:       Colore[];
    colores:       Colore[];
    marcas:        Colore[];
}

export interface Colore {
    id:                  number;
    color?:              string;
    total_categoria:     string;
    total_subcategorias: TotalSubcategoria[];
    genero?:             string;
    marca?:              string;
}

export interface TotalSubcategoria {
    id_sub:   number;
    nombre:   string;
    cantidad: number;
}

export interface Subcategoria {
    id:       number;
    nombre:   string;
    cantidad: number;
}
