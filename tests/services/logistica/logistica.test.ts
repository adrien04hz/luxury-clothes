//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 11/03/2026 */
//**********/
import { LogisticaService } from "@/services/logistica/logistica.service";
import { LogisticaRepository } from "@/repositories/logistica/logistica.repository";
import { QueryResult } from 'pg';

jest.mock("@/repositories/logistica/logistica.repository", () => ({
  LogisticaRepository: {
    obtenerEstadoPedido: jest.fn(),
    actualizarEstadoPedido: jest.fn(),
    obtenerInformacionPedido: jest.fn(),
  },
}));

describe("LogisticaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // obtenerEstadoPedido
  // =============================================
  describe("Obtener el estado del pedido", () => {
    test("retorna el estado actual correctamente", async () => {
      const mockEstado = {
        id_pedido: 150,
        estado: "En preparación",
        descripcion: "El pedido está siendo empacado",
        fecha: "2026-03-13T10:00:00Z"
      };

      (LogisticaRepository.obtenerEstadoPedido as jest.Mock).mockResolvedValue({
        rows: [mockEstado],
        rowCount: 1
      } as QueryResult);

      const result = await LogisticaService.obtenerEstadoPedido(150);

      expect(result).toEqual(mockEstado);
      expect(LogisticaRepository.obtenerEstadoPedido).toHaveBeenCalledWith(150);
    });

    test("lanza error si el pedido no existe", async () => {
      (LogisticaRepository.obtenerEstadoPedido as jest.Mock).mockResolvedValue({
          rows: [],
          rowCount: 0
      } as unknown as QueryResult);

      await expect(LogisticaService.obtenerEstadoPedido(999))
        .rejects.toThrow("Pedido no encontrado");
    });
  });

  // =============================================
  // actualizarEstadoPedido
  // =============================================
  describe("Actualizar el estado del pedido tras realizar acciones (empacar, entregar, enviar, etc)", () => {
    test("actualiza estado y registra historial correctamente", async () => {
      (LogisticaRepository.actualizarEstadoPedido as jest.Mock).mockResolvedValue({
        rows: [{ id: 150, id_estado_pedido: 3 }],
        historial: { id: 78 }
      });

      const result = await LogisticaService.actualizarEstadoPedido(150, 3, 5); // 5 = id del repartidor

      expect(result.mensaje).toContain("actualizado correctamente");
      expect(result.id_pedido).toBe(150);
      expect(result.nuevo_estado).toBe(3);
      expect(LogisticaRepository.actualizarEstadoPedido)
        .toHaveBeenCalledWith(150, 3, 5);
    });

    test("lanza error si no se envía nuevo estado", async () => {
      await expect(LogisticaService.actualizarEstadoPedido(150, 0, 5))
        .rejects.toThrow("Debe especificar el nuevo estado");
    });
  });

  // =============================================
  // obtenerInformacionPedido
  // =============================================
  describe("Obtener información del pedido para ver datos sobre a quien entrego o si cancelo el pedido el cliente o regresar el pedido", () => {
    test("retorna toda la información para el repartidor", async () => {
      const mockInfo = {
        id_pedido: 150,
        total: 1250.00,
        estado_actual: "En camino",
        nombre_cliente: "María",
        apellidos_cliente: "González López",
        calle: "Av. Independencia",
        numero_exterior: "123",
        ciudad: "Oaxaca",
        numero_guia: "OXA-987654",
        fecha_entrega_estimada: "2026-03-15T18:00:00Z"
      };

      (LogisticaRepository.obtenerInformacionPedido as jest.Mock).mockResolvedValue({
        rows: [mockInfo],
        rowCount: 1
      } as QueryResult);

      const result = await LogisticaService.obtenerInformacionPedido(150);

      expect(result).toEqual(mockInfo);
      expect(result.nombre_cliente).toBe("María");
      expect(LogisticaRepository.obtenerInformacionPedido).toHaveBeenCalledWith(150);
    });

    test("lanza error si no existe el pedido", async () => {
      (LogisticaRepository.obtenerInformacionPedido as jest.Mock).mockResolvedValue({
          rows: [],
          rowCount: 0
      } as unknown as QueryResult);

      await expect(LogisticaService.obtenerInformacionPedido(999))
        .rejects.toThrow("Pedido no encontrado o no tiene información de envío");
    });
  });
});