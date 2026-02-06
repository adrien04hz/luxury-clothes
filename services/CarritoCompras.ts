/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { Carrito } from '@/repositories/Carrito';

export class CarritoCompras {

    static async addProduct(customerId: number, productId: number, quantity: number) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }
        await Carrito.addProduct(customerId, productId, quantity);
    }

    static async deleteProduct(customerId: number, productId: number) {
        await Carrito.removeProduct(customerId, productId);
    }

    static async increaseQuantityProduct(customerId: number, productId: number) {
        await Carrito.increaseQuantity(customerId, productId);
    }

    static async decreaseQuantityProduct(customerId: number, productId: number) {
        await Carrito.decreaseQuantity(customerId, productId);
    }

    static async getCart(customerId: number) {
        return await Carrito.getCartByCustomerId(customerId);
    }

    static async dropCart(customerId: number) {
        await Carrito.clearCart(customerId);
    }

    static async isProductInCart(customerId: number, productId: number) {
        return await Carrito.getProductInCart(customerId, productId);
    }
}
