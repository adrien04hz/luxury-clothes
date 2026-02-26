//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 25/02/2026 */
//**********/
import { PedidoService } from "@/services/pedido.service"; // ajusta ruta si es necesario
import { PedidoRepository } from "@/repositories/Pedido.repositorie";

jest.mock("@/repositories/Pedido.repositorie", () => ({
    PedidoRepository: {
        cancelarPedido: jest.fn(),
        estadoPedido: jest.fn(),
    },
}));

describe("PedidoService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //************************************/
    // Cancelaion de pedido
    //************************************/

    describe("cancelarPedido", () => {
        test("cancela pedido correctamente cuando está permitido", async () => {
            (PedidoRepository.cancelarPedido as jest.Mock).mockResolvedValue({
                rowCount: 1,
                rows: [{ id: 25, estado: "cancelado" }],
            });

            const result = await PedidoService.cancelarPedido(25);

            expect(result).toMatchObject({
                mensaje: "Pedido cancelado correctamente",
                pedidoId: 25,
                nuevoEstado: "cancelado",
            });
            expect(PedidoRepository.cancelarPedido).toHaveBeenCalledWith(25);
        });

        test("lanza error si el pedido no puede ser cancelado o no existe", async () => {
            (PedidoRepository.cancelarPedido as jest.Mock).mockResolvedValue({
                rowCount: 0,
                rows: [],
            });

            await expect(PedidoService.cancelarPedido(999)).rejects.toThrow(
                "El pedido no existe o no se puede cancelar en su estado actual"
            );
        });
    });

    //************************************/
    // Estado de pedido
    //************************************/

    describe("obtenerEstadoPedido", () => {
        test("retorna el estado del pedido cuando existe", async () => {
            const mockPedido = {
                id: 30,
                estado: "en proceso",
                fecha_pedido: "2026-02-20",
            };

            (PedidoRepository.estadoPedido as jest.Mock).mockResolvedValue({
                rowCount: 1,
                rows: [mockPedido],
            });

            const result = await PedidoService.obtenerEstadoPedido(30);

            expect(result).toEqual(mockPedido);
            expect(PedidoRepository.estadoPedido).toHaveBeenCalledWith(30);
        });

        test("lanza error si el pedido no existe", async () => {
            (PedidoRepository.estadoPedido as jest.Mock).mockResolvedValue({
                rowCount: 0,
                rows: [],
            });

            await expect(PedidoService.obtenerEstadoPedido(999)).rejects.toThrow(
                "Pedido no encontrado"
            );
        });
    });
});