/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { Producto as ProductoRepo } from '@/repositories/producto/producto.repository';

export class Producto {

    /**
     * Función para obtener el catálogo de productos
     * @param id_genero - ID del género para filtrar productos (opcional)
     * @param id_categoria - ID de la categoría para filtrar productos (opcional)
     * @param id_subcategoria - ID de la subcategoría para filtrar productos (opcional)
     * @param id_marca - ID de la marca para filtrar productos (opcional)
     * @param id_color - ID del color para filtrar productos (opcional)
     * @param limit - Número máximo de productos a retornar (opcional)
     * @returns Lista de productos que coinciden con los filtros aplicados
     */
    static async getCatalog({
        id_genero,
        id_categoria,
        id_subcategoria,
        id_marca,
        id_color,
        limit,
        order,
    }: {
        id_genero?: number;
        id_categoria?: number;
        id_subcategoria?: number;
        id_marca?: number;
        id_color?: number;
        limit?: number;
        order?: string;
    }) {
        return await ProductoRepo.getAllProducts({
            id_genero,
            id_categoria,
            id_subcategoria,
            id_marca,
            id_color,
            limit,
            order,
        });
    }


    /**
     * Función para obtener los detalles de un producto específico
     * @param productId - ID del producto para el cual se desean obtener los detalles
     * @returns Detalles del producto, incluyendo nombre, descripción, precio, color, marca, imágenes y stock por talla
     */
    static async getProductDetails(productId: number) {
        return await ProductoRepo.productDetails(productId);
    }


    //***********/
    //* Nombre del equipo: Equipo 1 */
    //* Autor : Diaz Antonio Luis Pedro*/
    //* Fecha: 22/04/2026 */
    //**********/
    static async getRandomProducts(limit: number = 5) {
        return await ProductoRepo.getCarrusel(limit);
    }

    static async getOneProducts() {
        return await ProductoRepo.getOneCategory();
    }

}