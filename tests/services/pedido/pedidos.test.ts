// //***********/
// //* Nombre del equipo: Equipo 1 */
// //* Autor de la clase: Ramos Bello Jose Luis */
// //* Fecha: 25/02/2026 */
// //**********/
import { PedidoService } from "@/services/pedido/pedido.service";
import { PedidoRepository } from "@/repositories/pedido/pedido.repository";

jest.mock("@/repositories/pedido/pedido.repository", () => ({
  PedidoRepository: {
    cancelarPedido: jest.fn(),
    estadoPedido: jest.fn(),
    getDetallePedido: jest.fn(),
    obtenerHistorialCliente: jest.fn(),
    procesarCompra: jest.fn(),
    crearPedidoDesdeCarrito: jest.fn(),
    obtenerComprobante: jest.fn(),
  },
}));

describe("PedidoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("cancelarPedido", () => {
    test("cancela pedido correctamente cuando está permitido", async () => {
      // Mock del repository (éxito)
      (PedidoRepository.cancelarPedido as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 25 }],
      });

      // Mock interno de obtenerEstadoPedido (porque el service lo llama)
      jest.spyOn(PedidoService, "obtenerEstadoPedido").mockResolvedValueOnce({
        estado: "cancelado",
      });

      const result = await PedidoService.cancelarPedido(25, 10);

      expect(result).toMatchObject({
        mensaje: expect.stringContaining("Pedido cancelado correctamente"),
        pedidoId: 25,
        nuevoEstado: "cancelado",
        motivo: "No especificado",
      });

      expect(PedidoRepository.cancelarPedido).toHaveBeenCalledWith(25, 10, undefined);
      expect(PedidoService.obtenerEstadoPedido).toHaveBeenCalledWith(25);
    });

    test("permite especificar motivo de cancelación", async () => {
      (PedidoRepository.cancelarPedido as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 28 }],
      });

      jest.spyOn(PedidoService, "obtenerEstadoPedido").mockResolvedValueOnce({
        estado: "cancelado",
      });

      const motivo = "Cliente cambió de opinión";
      const result = await PedidoService.cancelarPedido(28, 7, motivo);

      expect(result).toMatchObject({
        mensaje: expect.stringContaining("Pedido cancelado correctamente"),
        pedidoId: 28,
        motivo,
        nuevoEstado: "cancelado",
      });

      expect(PedidoRepository.cancelarPedido).toHaveBeenCalledWith(28, 7, motivo);
      expect(PedidoService.obtenerEstadoPedido).toHaveBeenCalledWith(28);
    });

    test("lanza error si el pedido no puede ser cancelado o no existe", async () => {
      (PedidoRepository.cancelarPedido as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await expect(PedidoService.cancelarPedido(999, 10)).rejects.toThrow(
        "El pedido no existe o no se puede cancelar en su estado actual"
      );

      expect(PedidoRepository.cancelarPedido).toHaveBeenCalledWith(999, 10, undefined);
      expect(PedidoService.obtenerEstadoPedido).not.toHaveBeenCalled();
    });
  });

  describe("procesarCompra", () => {
    test("crea pedido correctamente con carrito válido", async () => {
      const mockPedido = {
        id: 100,
        total: 1500.00,
        estado: "pendiente",
        fecha: new Date().toISOString(),
        notas: "Sin notas",
      };

      (PedidoRepository.crearPedidoDesdeCarrito as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [mockPedido],
      });

      const resultado = await PedidoService.procesarCompra(5, 1, 2, "Sin notas");

      expect(resultado).toMatchObject({
        mensaje: expect.stringContaining("Compra procesada correctamente"),
        pedido: {
          id: 100,
          total: 1500.00,
          estado: "pendiente",
        },
      });

      expect(PedidoRepository.crearPedidoDesdeCarrito).toHaveBeenCalledWith(
        5,
        1,
        2,
        "Sin notas"
      );
    });

    test("lanza error específico si carrito está vacío o sin stock", async () => {
      // Caso stock insuficiente (el que más probablemente está ocurriendo)
      (PedidoRepository.crearPedidoDesdeCarrito as jest.Mock).mockRejectedValue(
        new Error("El carrito está vacío o no hay stock suficiente para algún producto")
      );

      await expect(PedidoService.procesarCompra(5, 1, 2)).rejects.toThrow(
        "No hay stock suficiente para uno o más productos"
      );

      // Caso carrito vacío (para cubrir la otra rama)
      (PedidoRepository.crearPedidoDesdeCarrito as jest.Mock).mockRejectedValueOnce(
        new Error("El carrito está vacío")
      );

      await expect(PedidoService.procesarCompra(5, 1, 2)).rejects.toThrow(
        "El carrito está vacío o los productos no están disponibles"
      );
    });

    test("lanza error genérico si falla por otra razón", async () => {
      const errorMsg = "Error de conexión inesperado";

      (PedidoRepository.crearPedidoDesdeCarrito as jest.Mock).mockRejectedValue(
        new Error(errorMsg)
      );

      await expect(PedidoService.procesarCompra(5, 1, 2)).rejects.toThrow(
        errorMsg   // ← coincide exactamente con el mensaje que lanza el catch final
      );
    });
  });

  describe("obtenerEstadoPedido", () => {
    test("devuelve correctamente el estado del pedido existente", async () => {
      (PedidoRepository.estadoPedido as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{
          estado: "enviado",
          fecha_estado: new Date().toISOString(),
        }],
      });

      const resultado = await PedidoService.obtenerEstadoPedido(123);

      expect(resultado.estado).toBe("enviado");
      expect(PedidoRepository.estadoPedido).toHaveBeenCalledWith(123);
    });
  });

  //***********/
  //* Nombre del equipo: Equipo 1 */
  //* Autor de la clase: Cervantes Rosales Abdiel */
  //* Fecha: 26/02/2026 */
  //**********/

  //************/
  // Detalle de pedido
  //************/

  describe("getDetalle", () => {
    test("retorna el detalle del pedido cuando existe", async () => {
      const mockDetalle = [
        {
          id_pedido: 1,
          producto: "Camisa Nike",
          talla: "M",
          cantidad: 1,
          precio_unitario: 299.99,
        },
      ];

      (PedidoRepository.getDetallePedido as jest.Mock).mockResolvedValue({
        rows: mockDetalle,
      });

      const result = await PedidoService.getDetalle(1);

      expect(result).toEqual(mockDetalle);
      expect(PedidoRepository.getDetallePedido).toHaveBeenCalledWith(1);
    });

    test("lanza error cuando el pedido no existe", async () => {
      (PedidoRepository.getDetallePedido as jest.Mock).mockResolvedValue({
        rows: [],
      });

      await expect(PedidoService.getDetalle(999)).rejects.toThrow(
        "Pedido no encontrado"
      );
    });
  });

  //************/
  // Historial pedidos usuario
  //************/

  describe("obtenerHistorialUsuario", () => {
    test("retorna historial cuando el usuario tiene pedidos", async () => {
      const mockHistorial = [
        {
          id_pedido: 1,
          fecha: "2026-02-25",
          total: 299.99,
          estado: "pagado",
          producto: "Camisa Nike",
          cantidad: 1,
          precio_unitario: 299.99,
        },
      ];

      const mockResponse = {
        rows: mockHistorial,
      };

      (PedidoRepository.obtenerHistorialCliente as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await PedidoService.obtenerHistorialUsuario(1);

      expect(result).toEqual(mockResponse);
      expect(PedidoRepository.obtenerHistorialCliente).toHaveBeenCalledWith(1);
    });

    test("retorna arreglo vacío si no hay pedidos", async () => {
      const mockResponse = {
        rows: [],
      };

      (PedidoRepository.obtenerHistorialCliente as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await PedidoService.obtenerHistorialUsuario(50);

      expect(result).toEqual(mockResponse);
    });
  });

  //************/
  // Obtener comprobante
  //************/

  describe("obtenerComprobante", () => {
    test("genera comprobante con datos del pedido", async () => {
      const mockComprobante = [
        {
          pedido_id: 1,
          fecha: "2026-02-25",
          total: 299.99,
          nombre: "Luis",
          apellidos: "Perez",
          correo: "test@test.com",
          producto: "Camisa Nike",
          talla: "M",
          cantidad: 1,
          precio_unitario: 299.99,
          metodo_pago: "tarjeta",
        },
      ];

      (PedidoRepository.obtenerComprobante as jest.Mock).mockResolvedValue({
        rows: mockComprobante,
      });

      const result = await PedidoService.obtenerComprobante(1);

      expect(result).toEqual(mockComprobante);
      expect(PedidoRepository.obtenerComprobante).toHaveBeenCalledWith(1);
    });

    test("lanza error si el pedido no existe", async () => {
      (PedidoRepository.obtenerComprobante as jest.Mock).mockResolvedValue({
        rows: [],
      });

      await expect(PedidoService.obtenerComprobante(500)).rejects.toThrow(
        "Pedido no encontrado"
      );
    });
  });
});
