export function breadCrumbs({
    id_categoria,
    id_subcategoria,
    id_genero
} : {
    id_categoria: number,
    id_subcategoria?: number,
    id_genero?: number
}) {
    const categorias: { [key: number]: string } = {
        1: "Ropa",
        2: "Calzado",
        3: "Accesorios"
    }
    
    const subcategorias: { [key: number]: string } = {
        1: "Playera",
        2: "Pantalón",
        3: "Sudadera",
        4: "Chamarra",
        5: "Shorts",
        6: "Jersey",
        7: "Calcetines",
        8: "Camisa",
        9: "Top",
        10: "Tenis",
        11: "Botas",
        12: "Sandalias",
        13: "Tacones",
        14: "Gorra",
        15: "Mochila",
        16: "Bolso",
        17: "Reloj",
        18: "Lentes",
        19: "Collar",
        20: "Anillo",
        21: "Pulsera",
        22: "Mocasines"
    }

    const generos: { [key: number]: string } = {
        1: "Hombre",
        2: "Mujer",
        3: "Niños",
        4: "Unisex"
    }

    return {
        categoria: categorias[id_categoria],
        subcategoria: id_subcategoria ? subcategorias[id_subcategoria] : undefined,
        genero: id_genero ? generos[id_genero] : undefined
    }
}