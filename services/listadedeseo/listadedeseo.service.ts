/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 6 de febrero de 2026
 */

import { DetalleListaDeseos } from "@/repositories/listadedeseo/listadedeseo.repository";

export class ListaDeseos {
    static async getWhislist(clientId: number) {
        if (!clientId) {
            throw new Error("Client ID is required");
        }
        return await DetalleListaDeseos.findByUserId(clientId);

    }

    static async addProduct(clientId: number, productId: number) {
        if (!clientId || !productId) {
            throw new Error("Client ID and Product ID are required");
        }
        //Encontrar el id del cliente
        let wishlist = await DetalleListaDeseos.findWishlistIdByClientId(clientId);

        //Si el cliente no tiene lista de deseos, crear una nueva
        if (!wishlist) {
            //llamamos a la función para crear la lista de deseos
            wishlist = await DetalleListaDeseos.createWishlistForClient(clientId);
        }

        //Si todo marcha bien, agregamos el producto a la lista de deseos
        await DetalleListaDeseos.addProductToWishlist(wishlist.id, productId);

    }

    static async deleteProduct(clientId: number, productId: number){
        const list = await DetalleListaDeseos.findWishlistIdByClientId(clientId);

        if(!list){
            throw new Error("Client ID is required");
        }

        //Si todo marcha bien, eliminamos el producto de la lista
        await DetalleListaDeseos.deleteProductToWishList(list.id, productId);


    }
}