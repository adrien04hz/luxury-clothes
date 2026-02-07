import { BusquedaArticuloService } from '@/services/BusquedaArticuloService';
import { BusquedaArticulo } from '@/repositories/BusquedaArticulo';

jest.mock('@/repositories/BusquedaArticulo');

describe('BusquedaService', () => {

  test('debe devolver resultados cuando hay coincidencias', async () => {
    // prueba
    const mockData = [
      { id: 1, nombre: 'Nike Air', precio: 2000 },
    ];

    (BusquedaArticulo.buscar as jest.Mock).mockResolvedValue(mockData);

    // Accion 
    const result = await BusquedaArticuloService.buscarArticulo('nike');

    // Respuesta
    expect(result).toEqual(mockData);
    expect(BusquedaArticulo.buscar).toHaveBeenCalledWith('nike');
  });

  test('debe lanzar error si la palabra está vacía', async () => {
    await expect(
      BusquedaArticuloService.buscarArticulo('')
    ).rejects.toThrow('Palabra requerida'); //se espera un error
  });

});
