import { CarritoCompras } from "@/services/carritodecompras/carritodecompras.service";
import { Carrito } from "@/repositories/carritodecompras/carritodecompras.repository";

jest.mock('@/repositories/carritodecompras/carritodecompras.repository', () => ({
  Carrito: {
    addProduct: jest.fn(),
    removeProduct: jest.fn(),
    setQuantity: jest.fn(),
    clearCart: jest.fn(),
    getCartByCustomerId: jest.fn(),
    getProductInCart: jest.fn(),
  },
}));


describe('CarritoCompras.addProduct', () => {

  it('agrega producto si la cantidad es válida', async () => {
    await CarritoCompras.addProduct(1, 10, 2);

    expect(Carrito.addProduct).toHaveBeenCalledWith(1, 10, 2);
  });

  it('lanza error si la cantidad es menor o igual a 0', async () => {
    await expect(
      CarritoCompras.addProduct(1, 10, 0)
    ).rejects.toThrow('La cantidad debe ser mayor a cero');
  });

});


describe('CarritoCompras.deleteProduct', () => {

  it('elimina el producto del carrito', async () => {
    await CarritoCompras.deleteProduct(1, 10);

    expect(Carrito.removeProduct).toHaveBeenCalledWith(1, 10);
  });

});


describe('CarritoCompras.increaseQuantityProduct', () => {

  it('incrementa la cantidad si el producto existe', async () => {
    (Carrito.getProductInCart as jest.Mock).mockResolvedValue({ id_producto: 10 });

    await CarritoCompras.increaseQuantityProduct(1, 10, 2);

    expect(Carrito.setQuantity).toHaveBeenCalledWith(1, 10, 3);
  });

  it('lanza error si la cantidad es inválida', async () => {
    await expect(
      CarritoCompras.increaseQuantityProduct(1, 10, 0)
    ).rejects.toThrow('La cantidad debe ser mayor a cero');
  });

  it('lanza error si el producto no está en el carrito', async () => {
    (Carrito.getProductInCart as jest.Mock).mockResolvedValue(undefined);

    await expect(
      CarritoCompras.increaseQuantityProduct(1, 10, 2)
    ).rejects.toThrow('El producto no está en el carrito');
  });

});


describe('CarritoCompras.decreaseQuantityProduct', () => {

  it('disminuye la cantidad si es mayor a 1', async () => {
    (Carrito.getProductInCart as jest.Mock).mockResolvedValue({ id_producto: 10 });

    await CarritoCompras.decreaseQuantityProduct(1, 10, 3);

    expect(Carrito.setQuantity).toHaveBeenCalledWith(1, 10, 2);
  });

  it('elimina el producto si la cantidad llega a 0', async () => {
    (Carrito.getProductInCart as jest.Mock).mockResolvedValue({ id_producto: 10 });

    await CarritoCompras.decreaseQuantityProduct(1, 10, 1);

    expect(Carrito.removeProduct).toHaveBeenCalledWith(1, 10);
  });

  it('lanza error si el producto no existe en el carrito', async () => {
    (Carrito.getProductInCart as jest.Mock).mockResolvedValue(undefined);

    await expect(
      CarritoCompras.decreaseQuantityProduct(1, 10, 2)
    ).rejects.toThrow('El producto no está en el carrito');
  });

});


describe('CarritoCompras.getCart', () => {

  it('retorna el carrito del cliente', async () => {
    const mockCart = [{ id: 1, nombre: 'Producto', cantidad: 2 }];
    (Carrito.getCartByCustomerId as jest.Mock).mockResolvedValue(mockCart);

    const result = await CarritoCompras.getCart(1);

    expect(result).toEqual(mockCart);
    expect(Carrito.getCartByCustomerId).toHaveBeenCalledWith(1);
  });

});


describe('CarritoCompras.dropCart', () => {

  it('vacía el carrito del cliente', async () => {
    await CarritoCompras.dropCart(1);

    expect(Carrito.clearCart).toHaveBeenCalledWith(1);
  });

});


describe('CarritoCompras.isProductInCart', () => {

  it('retorna true si el producto está en el carrito', async () => {
    (Carrito.getProductInCart as jest.Mock).mockResolvedValue({ id_producto: 10 });

    const result = await CarritoCompras.isProductInCart(1, 10);

    expect(result).toBeTruthy();
  });

});