// tests/carrito.test.ts
import { CarritoCompras } from '@/services/carritodecompras/carritodecompras.service';
import { pool } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('CarritoCompras (service + repo)', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Añadir producto al carrito -> addProduct', () => {

    it('agrega producto al carrito', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await CarritoCompras.addProduct({
        id_usuario: 1,
        id_producto: 10,
        id_talla: 2,
        cantidad: 3
      });

      expect(pool.query).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('lanza error si cantidad <= 0', async () => {
      await expect(
        CarritoCompras.addProduct({
          id_usuario: 1,
          id_producto: 10,
          id_talla: 2,
          cantidad: 0
        })
      ).rejects.toThrow('La cantidad debe ser mayor a cero');
    });

  });

  describe('Eliminar producto del carrito -> deleteProduct', () => {

    it('elimina producto del carrito', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await CarritoCompras.deleteProduct({
        id_usuario: 1,
        id_producto: 10,
        id_talla: 2
      });

      expect(result).toBe(true);
    });

  });

  describe('Aumentar cantidad de producto -> increaseQuantityProduct', () => {

    it('incrementa cantidad', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await CarritoCompras.increaseQuantityProduct({
        id_usuario: 1,
        id_producto: 10,
        id_talla: 2,
        cantidad: 2
      });

      expect(pool.query).toHaveBeenCalled();
      expect(result).toBe(true);
    });

  });

  describe('Disminuir cantidad de producto -> decreaseQuantityProduct', () => {

    it('disminuye cantidad', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await CarritoCompras.decreaseQuantityProduct({
        id_usuario: 1,
        id_producto: 10,
        id_talla: 2,
        cantidad: 2
      });

      expect(result).toBe(true);
    });

  });

  describe('Obtener carrito de usuario -> getCart', () => {

    it('retorna carrito del usuario', async () => {

      const mockCart = [
        {
          id_producto: 10,
          nombre: 'Camisa',
          precio: 500,
          talla: 'M',
          cantidad: 2,
          imagen: 'img.jpg'
        }
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockCart
      });

      const result = await CarritoCompras.getCart(1);

      expect(result).toEqual(mockCart);
    });

  });

  describe('Vaciar carrito de usuario -> dropCart', () => {

    it('vacía carrito', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 3 });

      const result = await CarritoCompras.dropCart(1);

      expect(result).toBe(true);
    });

  });

});