import { BusquedaArticulo, FiltroArticulo } from "@/repositories/motordebusqueda/motordebusqueda.repository";
import { BusquedaArticuloService, FiltroArticuloService } from "@/services/motordebusqueda/motordebusqueda.service";


jest.mock('@/repositories/motordebusqueda/motordebusqueda.repository', () => ({
  BusquedaArticulo: {
    buscar: jest.fn(),
  },
  FiltroArticulo: {
    filtrar: jest.fn(),
  },
}));

describe('BusquedaArticulo', () => {

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

describe('FiltroArticulo', () => {

  test('debe devolver resultados cuando hay coincidencias', async () => {
    const mockData = [
      { id: 1, nombre: 'Nike Air', precio: 2000 },
    ];

    (FiltroArticulo.filtrar as jest.Mock).mockResolvedValue(mockData);


    const result = await FiltroArticuloService.filtrar({
      palabra: 'nike',
    });

    // Assert
    expect(result).toEqual(mockData);
    expect(FiltroArticulo.filtrar).toHaveBeenCalledWith(
      'nike',   // palabra
      null,     // idCategoria
      null,     // idMarca
      null,     // precioMin
      null,     // precioMax
      true,     // soloActivos (default)
      false     // conStock (default)
    );
  });

  test('debe lanzar error si el precio mínimo es negativo', async () => {
    await expect(
      FiltroArticuloService.filtrar({
        precioMin: -10,
      })
    ).rejects.toThrow('El precio mínimo no puede ser negativo');
  });

  test('debe lanzar error si el precio máximo es negativo', async () => {
    await expect(
      FiltroArticuloService.filtrar({
        precioMax: -5,
      })
    ).rejects.toThrow('El precio máximo no puede ser negativo');
  });

  test('debe lanzar error si el precio mínimo es mayor al máximo', async () => {
    await expect(
      FiltroArticuloService.filtrar({
        precioMin: 500,
        precioMax: 100,
      })
    ).rejects.toThrow('El precio mínimo no puede ser mayor al máximo');
  });
});
