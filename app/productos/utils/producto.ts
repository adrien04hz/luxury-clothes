export function breadCrumbs({
    id_categoria,
    id_subcategoria,
    id_genero,
    id_marca,
} : {
    id_categoria: number,
    id_subcategoria?: number,
    id_genero?: number,
    id_marca?: number
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

    const marcas: { [key: number]: string } = {
        1: "Louis Vuitton",
        2: "Chanel",
        3: "Dior",
        4: "Céline",
        5: "Prada",
        6: "Balenciaga",
        7: "Valentino",
        8: "Saint Laurent",
        9: "Givenchy",
        10: "Burberry",
        11: "Salvatore Ferragamo",
        12: "Christian Louboutin",
        13: "Jimmy Choo",
        14: "Manolo Blahnik",
        15: "Bottega Veneta",
        16: "Off-White",
        17: "Maison Margiela",
        18: "Golden Goose",
        19: "Hermès",
        20: "Rolex",
        21: "Chopard",
        22: "Montblanc",
        23: "Tiffany & Co.",
        24: "Bulgari",
        25: "Loewe",
        26: "Delvaux",
        27: "Goyard",
        28: "Cartier"
    }

    return {
        categoria: categorias[id_categoria],
        subcategoria: id_subcategoria ? subcategorias[id_subcategoria] : undefined,
        genero: id_genero ? generos[id_genero] : undefined,
        marca: id_marca ? marcas[id_marca] : undefined
    }
}