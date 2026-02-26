//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 26/02/2026 */
//**********/
import { ProductoService } from "@/services/administrador.service"; // ajusta ruta si es necesario
import { AdministradorRepository } from "@/repositories/administrador.repositories";

jest.mock("@/repositories/administrador.repositories", () => ({
    AdministradorRepository: {
        obtenerClientesActivos: jest.fn(),
        crearProducto: jest.fn(),
        actualizarProducto: jest.fn(),
        desactivarProducto: jest.fn(),
    },
}));

describe("ProductoService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //************************************/
    // Lista de Clientes
    //************************************/
    describe("listaClientes", () => {
        test("retorna lista de clientes activos cuando existen", async () => {
            const mockClientes = [
                { id: 1, nombre: "Ana López" },
                { id: 2, nombre: "Carlos Ramírez" },
            ];

            (AdministradorRepository.obtenerClientesActivos as jest.Mock).mockResolvedValue({
                rows: mockClientes,
            });

            const result = await ProductoService.listaClientes();

            expect(result).toEqual(mockClientes);
            expect(AdministradorRepository.obtenerClientesActivos).toHaveBeenCalled();
        });

        test("retorna array vacío cuando no hay clientes activos", async () => {
            (AdministradorRepository.obtenerClientesActivos as jest.Mock).mockResolvedValue({
                rows: [],
            });

            const result = await ProductoService.listaClientes();

            expect(result).toEqual([]);
        });
    });

    //************************************/
    // Agregar producto
    //************************************/
    describe("agregarProducto", () => {
        test("crea producto correctamente con datos válidos", async () => {
            const datos = {
                nombre: "Lentes de sol",
                precio: 899,
                stock: 25,
                marca: "Gucci",
                categorias: ["Accesorio", "Hombre"],
            };

            const mockProductoCreado = {
                id: 42,
                ...datos,
                estaActivo: true,
            };

            (AdministradorRepository.crearProducto as jest.Mock).mockResolvedValue({
                rowCount: 1,
                rows: [mockProductoCreado],
            });

            const result = await ProductoService.agregarProducto(datos);

            expect(result).toEqual(mockProductoCreado);
            expect(AdministradorRepository.crearProducto).toHaveBeenCalledWith(datos);
        });

        test("lanza error si faltan campos obligatorios", async () => {
            await expect(
                ProductoService.agregarProducto({ nombre: "Solo nombre", stock: 10 })
            ).rejects.toThrow("Faltan campos obligatorios: nombre, precio y stock");
        });


        // estos tres test es solo para validar que lanza errores de inserciones cuando los campos no estan completos
        // o cuando el precio es negativo o cero, o cuando el stock es negativo. No se valida la logica de
        // validacion en el servicio, solo que se lancen errores cuando los datos no son correctos.


        // precio == 0
        
        test("lanza error si precio es negativo o cero", async () => {
             await expect(
               ProductoService.agregarProducto({
                 nombre: "Sudaddera",
                 precio: 0,
                 stock: 10,
               })
             ).rejects.toThrow("El precio debe ser mayor a 0");
           });
       
       // precio negativo
       
           test("lanza error si precio es negativo", async () => {
             await expect(
               ProductoService.agregarProducto({
                 nombre: "Pantalon",
                 precio: -50,
                 stock: 10,
               })
             ).rejects.toThrow("El precio debe ser mayor a 0");
           });
       
       // stack negativo
       
           test("lanza error si stock es negativo", async () => {
             await expect(
               ProductoService.agregarProducto({
                 nombre: "Producto",
                 precio: 500,
                 stock: -5,
               })
             ).rejects.toThrow("El stock no puede ser negativo");
           });
    });

    //************************************/
    // Modificar producto
    //************************************/
    describe("actualizarProducto", () => {
        test("actualiza producto correctamente con campos válidos", async () => {
            const datos = {
                nombre: "Mouse Actualizado",
                precio: 999,
            };

            (AdministradorRepository.actualizarProducto as jest.Mock).mockResolvedValue({
                rowCount: 1,
                rows: [{ id: 42, ...datos }],
            });

            const result = await ProductoService.actualizarProducto(42, datos);

            expect(result).toMatchObject(datos);
            expect(AdministradorRepository.actualizarProducto).toHaveBeenCalledWith(42, datos);
        });

        test("lanza error si no se envían campos para actualizar", async () => {
            await expect(ProductoService.actualizarProducto(42, {})).rejects.toThrow(
                "No se proporcionaron campos para actualizar"
            );
        });
    });

    //************************************/
    // Eliminar producto
    //************************************/
    describe("eliminarProducto", () => {
        test("desactiva producto correctamente cuando existe", async () => {
            (AdministradorRepository.desactivarProducto as jest.Mock).mockResolvedValue({
                rowCount: 1,
                rows: [{ id: 10 }],
            });

            const result = await ProductoService.eliminarProducto(10);

            expect(result).toEqual({
                mensaje: "Producto desactivado correctamente",
                id: 10,
            });

            expect(AdministradorRepository.desactivarProducto).toHaveBeenCalledWith(10);
        });

        test("lanza error si producto no existe o ya está inactivo", async () => {
            (AdministradorRepository.desactivarProducto as jest.Mock).mockResolvedValue({
                rowCount: 0,
                rows: [],
            });

            await expect(ProductoService.eliminarProducto(999)).rejects.toThrow(
                "Producto no encontrado o ya está inactivo"
            );
        });
    });
});