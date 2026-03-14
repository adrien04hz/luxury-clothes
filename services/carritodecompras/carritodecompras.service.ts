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

    /**
     * Función para incrementar la cantidad de un producto en el carrito de compras de un cliente.
     * @param id_usuario - ID del cliente del cual se desea actualizar la cantidad del producto
     * @param id_producto - ID del producto del cual se desea actualizar la cantidad
     * @param id_talla - ID de la talla del producto del cual se desea actualizar la cantidad
     * @param cantidad - Nueva cantidad del producto en el carrito de compras
    * @return boolean - Retorna true si la cantidad se actualizó correctamente, false en caso contrario 
    */
    static async increaseQuantityProduct(
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
        const result = await Carrito.setQuantity({ id_usuario, id_producto, id_talla, cantidad: cantidad + 1 });

        return result;
    }


    /**
     * Función para decrementar la cantidad de un producto en el carrito de compras de un cliente.
     * @param id_usuario - ID del cliente del cual se desea actualizar la cantidad del producto
     * @param id_producto - ID del producto del cual se desea actualizar la cantidad
     * @param id_talla - ID de la talla del producto del cual se desea actualizar la cantidad
     * @param cantidad - Nueva cantidad del producto en el carrito de compras
    * @return boolean - Retorna true si la cantidad se actualizó correctamente, false en caso contrario 
    */
    static async decreaseQuantityProduct(
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
        const result = await Carrito.setQuantity({ id_usuario, id_producto, id_talla, cantidad: cantidad - 1 });

        return result;
    }


    /**
     * Función para obtener el carrito de compras de un cliente por su ID.
     * @param customerId - ID del cliente para obtener su carrito de compras
     * @returns Lista de productos en el carrito de compras del cliente, incluyendo nombre, precio, talla, cantidad e imagen
     */
    static async getCart(customerId: number) {
        return await Carrito.getCartByCustomerId(customerId);
    }


    /**
     * Función para eliminar un producto del carrito de compras de un cliente.
     * @param id_usuario - ID del cliente del cual se desea eliminar el producto
     * @param id_producto - ID del producto que se desea eliminar del carrito de compras
     * @returns boolean - Retorna true si el producto se eliminó correctamente, false en caso contrario
     */
    static async dropCart(customerId: number) {
        return await Carrito.clearCart(customerId);
    }
}
