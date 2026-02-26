import { MetodoDePagoRepository } from "@/repositories/metododepago/metododepago.repository";
import { MetodoDePagoService } from "@/services/metododepago/metododepago.service";

jest.mock('@/repositories/metododepago/metododepago.repository', () => ({
  MetodoDePagoRepository: {
    Ver: jest.fn(),
    agregarMetodo: jest.fn(),
    eliminarMetodo: jest.fn(),
  },
}));

// vizualizar los metodos disponibles
describe('Ver Metodos de Pago Disponibles', () => {

  test('debe devolver los métodos de pago del cliente', async () => {
    // Datos simulados
    const mockData = [
      {
        id: 1,
        id_cliente: 10,
        id_tipo: 1,
        numero_cuenta: '****1111',
        activo: true,
      },
      {
        id: 2,
        id_cliente: 10,
        id_tipo: 4,
        numero_cuenta: 'cliente@email.com',
        activo: true,
      },
    ];
    // Simular respuesta del repository
    (MetodoDePagoRepository.Ver as jest.Mock).mockResolvedValue(mockData);
    // Acción
    const result = await MetodoDePagoService.VerMetodos(10);
    // Validación
    expect(result).toEqual(mockData);
    // Verificar que se llamó correctamente
    expect(MetodoDePagoRepository.Ver).toHaveBeenCalledWith(10);
  });

  test('debe devolver array vacío si no tiene métodos', async () => {
    (MetodoDePagoRepository.Ver as jest.Mock).mockResolvedValue([]);
    const result = await MetodoDePagoService.VerMetodos(99);
    expect(result).toEqual([]);
    expect(MetodoDePagoRepository.Ver).toHaveBeenCalledWith(99);
  });

  test('debe lanzar error si el repository falla', async () => {
    (MetodoDePagoRepository.Ver as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));
    await expect(
      MetodoDePagoService.VerMetodos(10)
    ).rejects.toThrow('Error de base de datos');
  });
});

// Agregar nuevos metodos
describe('Agregar nuevo metodo de pago', () => {

  test('debe agregar un método correctamente', async () => {

    const metodoNuevo = {
      id: 1,
      id_cliente: 1,
      id_tipo: 1,
      numero_cuenta: '1234567890123456',
    };

    (MetodoDePagoRepository.Ver as jest.Mock).mockResolvedValue([]);
    (MetodoDePagoRepository.agregarMetodo as jest.Mock).mockResolvedValue(metodoNuevo);

    const result = await MetodoDePagoService.agregarMetodo(
      10, 1, '1234567890123456', 'Luis Diaz', '2029-12-01', null, null, 'VISA'
    );
    expect(result).toEqual(metodoNuevo);
    expect(MetodoDePagoRepository.agregarMetodo).toHaveBeenCalled();
  });

  test('debe lanzar error si cliente no existe', async () => {

    await expect(
      MetodoDePagoService.agregarMetodo(
        0, 2, '123', null, null, null, null, null
      )
    ).rejects.toThrow("Cliente requerido");
  });

  test('debe lanzar error si Tipo no existe', async () => {

    await expect(
      MetodoDePagoService.agregarMetodo(
        10, 10, '123', null, null, null, null, null
      )
    ).rejects.toThrow("Tipo requerido");
  });

  test('debe lanzar error si cliente tiene 5 métodos', async () => {

    const metodosMock = [{}, {}, {}, {}, {}];

    (MetodoDePagoRepository.Ver as jest.Mock).mockResolvedValue(metodosMock);

    await expect(
      MetodoDePagoService.agregarMetodo(
        20, 1, '123', null, null, null, null, null
      )
    ).rejects.toThrow("El cliente ya tiene el máximo de 5 métodos de pago")
  });

  test('debe lanzar error si el metodo esta duplicado por numero de cuenta', async () => {

    const metodosMock = [{ numero_cuenta: '123456', correo: null }];

    (MetodoDePagoRepository.Ver as jest.Mock).mockResolvedValue(metodosMock);

    await expect(
      MetodoDePagoService.agregarMetodo(
        20, 1, '123456', null, null, null, null, null
      )
    ).rejects.toThrow("Este método de pago ya está registrado")
  });

  test('debe lanzar error si el metodo esta duplicado correo', async () => {

    const metodosMock = [{ numero_cuenta: null, correo: 'correo@test.com' }];

    (MetodoDePagoRepository.Ver as jest.Mock).mockResolvedValue(metodosMock);

    await expect(
      MetodoDePagoService.agregarMetodo(
        20, 1, null, null, null, null, 'correo@test.com', null
      )
    ).rejects.toThrow("Este método de pago ya está registrado")
  });
});

// eliminar metodo de pago en base a id_cliente y id (metodos)
describe('Eliminar metodo de pago', () => {

  test('debe lanzar error si cliente no existe', async () => {

    await expect(
      MetodoDePagoService.eliminarMetodo(0, 2)
    ).rejects.toThrow("Cliente requerido");

  });

  test('debe lanzar error si metodo no existe', async () => {

    (MetodoDePagoRepository.eliminarMetodo as jest.Mock).mockResolvedValue(null);

    await expect(
      MetodoDePagoService.eliminarMetodo(10, 99)
    ).rejects.toThrow("Metodo de pago no encontrado");

  });


  test('debe eliminar metodo correctamente', async () => {
    const mockMetodo = {
      id: 2,
      id_cliente: 10,
      id_tipo: 1,
      numero_cuenta: '****1111',
      activo: false,
    };

    (MetodoDePagoRepository.eliminarMetodo as jest.Mock).mockResolvedValue(mockMetodo);

    const result = await MetodoDePagoService.eliminarMetodo(10, 2);

    expect(result).toEqual(mockMetodo);

    expect(MetodoDePagoRepository.eliminarMetodo).toHaveBeenCalledWith(10, 2);

  });

});