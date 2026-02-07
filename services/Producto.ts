/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { Producto as ProductoRepo } from '@/repositories/Producto';
export class Producto {
    static async getProductDetails(productId: number) {
        return await ProductoRepo.productDetails(productId);
    }
}