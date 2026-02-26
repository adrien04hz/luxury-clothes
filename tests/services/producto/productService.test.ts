import { Producto } from '@/services/producto/producto.service';
import { Producto as ProductoRepo } from '@/repositories/producto/producto.repository';

jest.mock('@/repositories/producto/producto.repository', () => ({
  Producto: {
    productDetails: jest.fn(),
  },
}));

describe('Producto Service', () => {

  it('obtiene los detalles del producto', async () => {
    const mockDetails = {
      id: 1,
      nombre: 'Camisa',
      precio: 500,
      stock: 10,
      marca: 'Nike',
      imagenes: ['img1.jpg'],
    };

    (ProductoRepo.productDetails as jest.Mock).mockResolvedValue(mockDetails);

    const result = await Producto.getProductDetails(1);

    expect(ProductoRepo.productDetails).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDetails);
  });

});
