import { ListaDeseos } from "@/services/listadedeseo/listadedeseo.service";
import { DetalleListaDeseos } from "@/repositories/listadedeseo/listadedeseo.repository";

jest.mock("@/repositories/listadedeseo/listadedeseo.repository");

describe("ListaDeseos Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("debe crear wishlist si no existe y agregar producto", async () => {

    (DetalleListaDeseos.productExists as jest.Mock)
      .mockResolvedValue(true);

    (DetalleListaDeseos.findWishlistIdByClientId as jest.Mock)
      .mockResolvedValue(null);

    (DetalleListaDeseos.createWishlistForClient as jest.Mock)
      .mockResolvedValue(10);

    (DetalleListaDeseos.addProductToWishlist as jest.Mock)
      .mockResolvedValue(undefined);

    await ListaDeseos.addProduct(1, 5);

    expect(DetalleListaDeseos.productExists).toHaveBeenCalledWith(5);

    expect(DetalleListaDeseos.findWishlistIdByClientId)
      .toHaveBeenCalledWith(1);

    expect(DetalleListaDeseos.createWishlistForClient)
      .toHaveBeenCalledWith(1);

    expect(DetalleListaDeseos.addProductToWishlist)
      .toHaveBeenCalledWith(10, 5);
  });

  it("debe obtener la lista de deseos del cliente", async () => {

    const fakeWishlist = [
      { id: 1, nombre: "Tenis Nike", precio: 2000 },
      { id: 2, nombre: "Playera Adidas", precio: 800 }
    ];

    (DetalleListaDeseos.findByUserId as jest.Mock)
      .mockResolvedValue(fakeWishlist);

    const result = await ListaDeseos.getWhishlist(1);

    expect(DetalleListaDeseos.findByUserId)
      .toHaveBeenCalledWith(1);

    expect(result).toEqual(fakeWishlist);
  });

  it("debe eliminar un producto de la wishlist", async () => {

    (DetalleListaDeseos.findWishlistIdByClientId as jest.Mock)
      .mockResolvedValue(10);

    (DetalleListaDeseos.deleteProductToWishList as jest.Mock)
      .mockResolvedValue(1);

    await ListaDeseos.deleteProduct(1, 5);

    expect(DetalleListaDeseos.findWishlistIdByClientId)
      .toHaveBeenCalledWith(1);

    expect(DetalleListaDeseos.deleteProductToWishList)
      .toHaveBeenCalledWith(10, 5);
  });

  it("debe lanzar error si el usuario no tiene wishlist al eliminar", async () => {

    (DetalleListaDeseos.findWishlistIdByClientId as jest.Mock)
      .mockResolvedValue(null);

    await expect(
      ListaDeseos.deleteProduct(1, 5)
    ).rejects.toThrow("Client does not have a wishlist");
  });

});