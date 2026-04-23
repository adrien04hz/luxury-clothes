/**
 * @author Adrien Hernández Sánchez
 * Repositorio de FiltroV2 para mostrar correctamente el filtro de productos
 * dentro del catálogo de productos y búsqueda de productos.
 * @version 1.0.0
 * @since 2024-06-01
 */

import { pool } from "@/lib/db";
import { QueryResult } from 'pg';

export class FilterV2Repository {
    /**
     * Obtener filtros correctamente en función de categoría
     * @author Adrien Hernández Sánchez
     * @param categoryId - ID de la categoría para la cual se desean obtener los filtros
     * @returns Promise con los filtros obtenidos de la base de datos
     */
    static async getFiltersByCategory( id_categoria: number ) {
        const queryBrands = `
            WITH productos_filtrados AS (
                SELECT P.*
                FROM "Producto" P
                JOIN "Subcategoria" S ON P.id_subcategoria = S.id
                WHERE S.id_categoria = $1
                ),

                sub_count AS (
                SELECT 
                    S.id,
                    S.nombre,
                    M.id AS marca_id,
                    COUNT(P2.id) AS cantidad
                FROM "Subcategoria" S
                CROSS JOIN "Marca" M
                LEFT JOIN productos_filtrados P2 
                    ON P2.id_subcategoria = S.id 
                    AND P2.id_marca = M.id
                WHERE S.id_categoria = $1
                GROUP BY S.id, M.id
                )

                SELECT 
                M.id,
                M.nombre AS marca,
                COUNT(P.id) AS total_categoria,

                (
                    SELECT json_agg(
                    json_build_object(
                        'id_sub', sc.id,
                        'nombre', sc.nombre,
                        'cantidad', sc.cantidad
                    )
                    )
                    FROM sub_count sc
                    WHERE sc.marca_id = M.id
                ) AS total_subcategorias

                FROM "Marca" M
                JOIN productos_filtrados P ON P.id_marca = M.id
                GROUP BY M.id;
        `;

        const queryGenders = `
            WITH productos_filtrados AS (
                SELECT P.*
                FROM "Producto" P
                JOIN "Subcategoria" S ON P.id_subcategoria = S.id
                WHERE S.id_categoria = $1
                ),

                sub_count AS (
                SELECT 
                    S.id,
                    S.nombre,
                    G.id AS genero_id,
                    COUNT(P2.id) AS cantidad
                FROM "Subcategoria" S
                CROSS JOIN "Genero" G
                LEFT JOIN productos_filtrados P2 
                    ON P2.id_subcategoria = S.id 
                    AND P2.id_genero = G.id
                WHERE S.id_categoria = $1
                GROUP BY S.id, G.id
                )

                SELECT 
                G.id,
                G.nombre AS genero,
                COUNT(P.id) AS total_categoria,

                (
                    SELECT json_agg(
                    json_build_object(
                        'id_sub', sc.id,
                        'nombre', sc.nombre,
                        'cantidad', sc.cantidad
                    )
                    )
                    FROM sub_count sc
                    WHERE sc.genero_id = G.id
                ) AS total_subcategorias

                FROM "Genero" G
                JOIN productos_filtrados P ON P.id_genero = G.id
                GROUP BY G.id;
        `;

        const queryColors = `
            WITH productos_filtrados AS (
                SELECT P.*
                FROM "Producto" P
                JOIN "Subcategoria" S ON P.id_subcategoria = S.id
                WHERE S.id_categoria = $1
                ),

                sub_count AS (
                SELECT 
                    S.id,
                    S.nombre,
                    C.id AS color_id,
                    COUNT(P2.id) AS cantidad
                FROM "Subcategoria" S
                CROSS JOIN "Color" C
                LEFT JOIN productos_filtrados P2 
                    ON P2.id_subcategoria = S.id 
                    AND P2.id_color = C.id
                WHERE S.id_categoria = $1
                GROUP BY S.id, C.id
                )

                SELECT 
                C.id,
                C.nombre AS color,
                COUNT(P.id) AS total_categoria,

                (
                    SELECT json_agg(
                    json_build_object(
                        'id_sub', sc.id,
                        'nombre', sc.nombre,
                        'cantidad', sc.cantidad
                    )
                    )
                    FROM sub_count sc
                    WHERE sc.color_id = C.id
                ) AS total_subcategorias

                FROM "Color" C
                JOIN productos_filtrados P ON P.id_color = C.id
                GROUP BY C.id;
        `;
        const querySubcategories = `
            WITH subcategorias_count AS (
            SELECT 
                S.id,
                S.nombre,
                COUNT(P.id) AS cantidad
            FROM "Subcategoria" S
            LEFT JOIN "Producto" P ON P.id_subcategoria = S.id
            WHERE S.id_categoria = $1
            GROUP BY S.id
            )
            SELECT json_agg(
            json_build_object(
                'id', id,
                'nombre', nombre,
                'cantidad', cantidad
            )
            ) AS subcategorias
            FROM subcategorias_count;
        `;

        const queryTotal = `
            SELECT COUNT(P.id) AS total_categoria
            FROM "Producto" P
            JOIN "Subcategoria" S ON P.id_subcategoria = S.id
            WHERE S.id_categoria = $1;
        `;
        
        const queryCategory = `SELECT nombre FROM "Categoria" WHERE id = $1;`;
            
        const [brandsResult, gendersResult, colorsResult, subcategoriesResult, totalResult, categoryResult] = await Promise.all([
            pool.query(queryBrands, [id_categoria]),
            pool.query(queryGenders, [id_categoria]),
            pool.query(queryColors, [id_categoria]),
            pool.query(querySubcategories, [id_categoria]),
            pool.query(queryTotal, [id_categoria]),
            pool.query(queryCategory, [id_categoria])
        ]);

        return {
            categoria: categoryResult.rows[0].nombre,
            total: totalResult.rows[0].total_categoria,
            cantidades: {
                subcategorias: subcategoriesResult.rows[0].subcategorias || [],
                generos: gendersResult.rows || [],
                colores: colorsResult.rows || [],
                marcas: brandsResult.rows || [],
            },
        };
    }
}