/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */

import { Carrito } from '@/repositories/carritodecompras/carritodecompras.repository';

export class CarritoCompras {

    /**
     * Función para agregar producto al carrito de compras.
     * @params id_usuario - ID del cliente que agrega el producto al carrito de compras
     * @params id_producto - ID del producto que se desea agregar al carrito de compras
     * @params id_talla - ID de la talla del producto que se desea agregar al carrito de compras
     * @params cantidad - Cantidad del producto que se desea agregar al carrito de compras
     * @throws Error si la cantidad es menor o igual a cero
     * @return void
     */
    static async addProduct(
        {
            id_usuario,
            id_producto,
            id_talla,
            cantidad
        } : {
            id_usuario: number;
            id_producto: number;
            id_talla: number;
            cantidad: number;
        }
    ) {
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }
        
        const result = await Carrito.addProduct({ id_usuario, id_producto, id_talla, cantidad });

        return result;
    }


    /**
   * Función para eliminar un producto del carrito de compras de un cliente.
   * @param id_usuario - ID del cliente del cual se desea eliminar el producto
   * @param id_producto - ID del producto que se desea eliminar del carrito de compras
   * @returns boolean - Retorna true si el producto se eliminó correctamente, false en caso contrario
   */
    static async deleteProduct({ id_usuario, id_producto, id_talla }: { id_usuario: number; id_producto: number; id_talla: number }) {
        
        const result = await Carrito.removeProduct({ id_usuario, id_producto, id_talla });

        return result;
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
