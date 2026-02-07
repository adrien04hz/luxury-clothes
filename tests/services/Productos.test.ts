import { Producto } from '@/repositories/Producto';
import { pool } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));


describe('Producto Repository - findAll', () => {

  it('retorna el catálogo de productos', async () => {
    const mockRows = [
      {
        id: 1,
        nombre: 'Camisa',
        precio: 500,
        stock: 10,
        marca: 'Nike',
        imagen_url: 'img.jpg',
      },
    ];

    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    const result = await Producto.findAll();

    expect(pool.query).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });

});


describe('Producto Repository - productDetails', () => {

  it('retorna los detalles de un producto', async () => {
    const mockProduct = {
      id: 1,
      nombre: 'Camisa',
      precio: 500,
      stock: 10,
      marca: 'Nike',
      imagenes: ['img1.jpg', 'img2.jpg'],
    };

    (pool.query as jest.Mock).mockResolvedValue({
      rows: [mockProduct],
    });

    const result = await Producto.productDetails(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      [1]
    );

    expect(result).toEqual(mockProduct);
  });

});
