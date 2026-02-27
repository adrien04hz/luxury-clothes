import { DireccionesEnvio } from "@/services/direcciondeenvio/direcciondeenvio.service";
import { DireccionEnvio } from "@/repositories/direcciondeenvio/direcciondeenvio.repository";

jest.mock('@/repositories/direcciondeenvio/direcciondeenvio.repository');

describe('DireccionesEnvioService', () => {

  const fakeAddress = {
    id: 1,
    id_cliente: 1,
    ciudad: "Zapopan",
    estado: "Jalisco",
    codigo_postal: "45100",
    colonia: "Chapalita",
    calle: "Av. Patria",
    numero_externo: "250",
    numero_interno: "3B"
  };

  //agregar direccion de envio
  it('debe agregar dirección si no existe duplicado', async () => {

    (DireccionEnvio.findDuplicateForCreate as jest.Mock)
      .mockResolvedValue(false);

    (DireccionEnvio.addShippingAddress as jest.Mock)
      .mockResolvedValue(fakeAddress);

    const result = await DireccionesEnvio.addAddress(1, fakeAddress);

    expect(DireccionEnvio.findDuplicateForCreate)
      .toHaveBeenCalledWith(1, fakeAddress);

    expect(DireccionEnvio.addShippingAddress)
      .toHaveBeenCalledWith(1, fakeAddress);

    expect(result).toEqual(fakeAddress);
  });

  it('debe lanzar error si existe duplicado al agregar', async () => {

    (DireccionEnvio.findDuplicateForCreate as jest.Mock)
      .mockResolvedValue(true);

    await expect(
      DireccionesEnvio.addAddress(1, fakeAddress)
    ).rejects.toThrow("Duplicate address for the same client is not allowed");
  });

//modificar direccion de envio
  it('debe actualizar dirección si pertenece al cliente y no es duplicado', async () => {

    (DireccionEnvio.findByUserId as jest.Mock)
      .mockResolvedValue([fakeAddress]);

    (DireccionEnvio.findDuplicateAddress as jest.Mock)
      .mockResolvedValue(false);

    (DireccionEnvio.updateShippingAddress as jest.Mock)
      .mockResolvedValue(fakeAddress);

    const result = await DireccionesEnvio.updateAddress(1, 1, fakeAddress);

    expect(DireccionEnvio.findByUserId).toHaveBeenCalledWith(1);
    expect(DireccionEnvio.findDuplicateAddress)
      .toHaveBeenCalledWith(1, 1, fakeAddress);
    expect(DireccionEnvio.updateShippingAddress)
      .toHaveBeenCalledWith(1, fakeAddress);

    expect(result).toEqual(fakeAddress);
  });

  it('debe lanzar error si la dirección no pertenece al cliente', async () => {

    (DireccionEnvio.findByUserId as jest.Mock)
      .mockResolvedValue([]);

    await expect(
      DireccionesEnvio.updateAddress(1, 99, fakeAddress)
    ).rejects.toThrow("Address not found for the given client");
  });

//eliminar direccion de envio
  it('debe eliminar dirección correctamente', async () => {

    (DireccionEnvio.findByUserId as jest.Mock)
      .mockResolvedValue([fakeAddress]);

    (DireccionEnvio.deleteShippingAddress as jest.Mock)
      .mockResolvedValue(fakeAddress);

    const result = await DireccionesEnvio.deleteAddress(1, 1);

    expect(DireccionEnvio.deleteShippingAddress)
      .toHaveBeenCalledWith(1, 1);

    expect(result).toEqual(fakeAddress);
  });

  // lista de direcciones de envio
  it('debe obtener todas las direcciones del cliente', async () => {

    (DireccionEnvio.findByUserId as jest.Mock)
      .mockResolvedValue([fakeAddress]);

    const result = await DireccionesEnvio.getAddresses(1);

    expect(DireccionEnvio.findByUserId).toHaveBeenCalledWith(1);
    expect(result.direcciones.length).toBe(1);
  });

});