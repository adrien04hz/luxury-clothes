/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 6 de febrero de 2026
 */

import { DetalleListaDeseos } from "@/repositories/listadedeseo/listadedeseo.repository";

export class ListaDeseos {
    static async getWhishlist(clientId: number) {
        if (!clientId) {
            throw new Error("Client ID is required");
        }
        return await DetalleListaDeseos.findByUserId(clientId);

    }

    static async addProduct(clientId: number, productId: number) {
        if (!clientId || !productId) {
            throw new Error("Client ID and Product ID are required");
        }
        const exists = await DetalleListaDeseos.productExists(productId);

        if (!exists) {
            throw new Error("El producto no existe");
        }
        //Encontrar el id del cliente
        let wishlist = await DetalleListaDeseos.findWishlistIdByClientId(clientId);

        //Si el cliente no tiene lista de deseos, crear una nueva
        if (!wishlist) {
            //llamamos a la función para crear la lista de deseos
            wishlist = await DetalleListaDeseos.createWishlistForClient(clientId);
        }

        //Si todo marcha bien, agregamos el producto a la lista de deseos
        await DetalleListaDeseos.addProductToWishlist(wishlist, productId);

    }

    static async deleteProduct(clientId: number, productId: number){
        const listId = await DetalleListaDeseos.findWishlistIdByClientId(clientId);

        if(!listId){
            throw new Error("Client does not have a wishlist");
        }
        
        const deleted = await DetalleListaDeseos.deleteProductToWishList(listId, productId);

        if(deleted === 0){
            throw new Error("El producto no existe en la lista de deseos del usuario");
        }

    }
}