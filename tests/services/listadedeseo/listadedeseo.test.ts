import { ListaDeseos } from "@/services/listadedeseo/listadedeseo.service";
import { DetalleListaDeseos } from "@/repositories/listadedeseo/listadedeseo.repository";

jest.mock('@/repositories/listadedeseo/listadedeseo.repository');

describe('ListaDeseosService', () => {

  it('debe crear lista si no existe y agregar producto', async () => {
    (DetalleListaDeseos.findWishlistIdByClientId as jest.Mock)
      .mockResolvedValue(null);

    (DetalleListaDeseos.createWishlistForClient as jest.Mock)
      .mockResolvedValue({ id: 10 });

    (DetalleListaDeseos.addProductToWishlist as jest.Mock)
      .mockResolvedValue(undefined);

    await ListaDeseos.addProduct(1, 5);

    expect(DetalleListaDeseos.findWishlistIdByClientId).toHaveBeenCalledWith(1);
    expect(DetalleListaDeseos.createWishlistForClient).toHaveBeenCalledWith(1);
    expect(DetalleListaDeseos.addProductToWishlist).toHaveBeenCalledWith(10, 5);
  });

  it('debe obtener la lista de deseos del cliente', async () => {
    const fakeWishlist = [
      { id: 1, nombre: 'Tenis', precio: 2000 }
    ];

    (DetalleListaDeseos.findByUserId as jest.Mock)
      .mockResolvedValue(fakeWishlist);

    const result = await ListaDeseos.getWhislist(1);

    expect(DetalleListaDeseos.findByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeWishlist);
  });

  it('debe eliminar un producto de la lista de deseos', async () => {
    (DetalleListaDeseos.findWishlistIdByClientId as jest.Mock)
      .mockResolvedValue({ id: 10 });

    (DetalleListaDeseos.deleteProductToWishList as jest.Mock)
      .mockResolvedValue(undefined);

    await ListaDeseos.deleteProduct(1, 5);

    expect(DetalleListaDeseos.findWishlistIdByClientId).toHaveBeenCalledWith(1);
    expect(DetalleListaDeseos.deleteProductToWishList)
      .toHaveBeenCalledWith(10, 5);
  });

});
