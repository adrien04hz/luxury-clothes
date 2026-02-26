import { Catalogo } from '@/services/Catalogo';
import { Producto } from '@/repositories/producto/producto.repository';

jest.mock('@/repositories/producto/producto.repository', () => ({
  Producto: {
    findAll: jest.fn(),
  },
}));


describe('Catalogo Service', () => {

  it('obtiene el catálogo de productos', async () => {
    const mockCatalogo = [
      { id: 1, nombre: 'Camisa' },
      { id: 2, nombre: 'Pantalón' },
    ];

    (Producto.findAll as jest.Mock).mockResolvedValue(mockCatalogo);

    const result = await Catalogo.getCatalog();

    expect(Producto.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockCatalogo);
  });

});
