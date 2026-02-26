/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { Carrito } from '@/repositories/carritodecompras/carritodecompras.repository';

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

    static async increaseQuantityProduct(customerId: number, productId: number, quantity: number) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }

        if (!await Carrito.getProductInCart(customerId, productId)) {
            throw new Error('El producto no está en el carrito');
        }

        if (quantity > 0) {

            await Carrito.setQuantity(customerId, productId, quantity + 1);
        }
    }

    static async decreaseQuantityProduct(customerId: number, productId: number, quantity: number) {
        quantity = quantity - 1;
        if (!await Carrito.getProductInCart(customerId, productId)) {
            throw new Error('El producto no está en el carrito');
        }

        if (quantity === 0) {
            return await Carrito.removeProduct(customerId, productId);
        }

        if (quantity > 0) {

            return await Carrito.setQuantity(customerId, productId, quantity);
        }

        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }
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
