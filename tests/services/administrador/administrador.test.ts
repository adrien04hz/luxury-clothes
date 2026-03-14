//***********/
//* Nombre del equipo: Equipo 1
//* Autor de la clase: Ramos Bello Jose Luis
//* Fecha: 13/03/2026
//**********/
import { ProductoService } from "@/services/administrador/administrador.service";
import { AdministradorRepository } from "@/repositories/administrador/administrador.repository";
import { QueryResult } from 'pg';

jest.mock("@/repositories/administrador/administrador.repository", () => ({
  AdministradorRepository: {
    obtenerClientesActivos: jest.fn(),
    crearProducto: jest.fn(),
    actualizarProducto: jest.fn(),
    desactivarProducto: jest.fn(),
    obtenerHistorialVentas: jest.fn(),
  },
}));

describe("ProductoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("lista de Clientes", () => {
    test("retorna lista de clientes activos cuando existen", async () => {
      const mockClientes = [
        { id: 1, nombre: "Ana", apellidos: "López García", correo: "ana@example.com", telefono: "9511234567" },
        { id: 2, nombre: "Carlos", apellidos: "Ramírez Pérez", correo: "carlos@example.com", telefono: "9519876543" },
      ];

      (AdministradorRepository.obtenerClientesActivos as jest.Mock).mockResolvedValue({
        rows: mockClientes,
      } as QueryResult);

      const result = await ProductoService.listaClientes();

      expect(result).toEqual(mockClientes);
      expect(AdministradorRepository.obtenerClientesActivos).toHaveBeenCalledTimes(1);
    });

    test("retorna array vacío cuando no hay clientes activos", async () => {
      (AdministradorRepository.obtenerClientesActivos as jest.Mock).mockResolvedValue({
          rows: [],
      } as unknown as QueryResult);

      const result = await ProductoService.listaClientes();

      expect(result).toEqual([]);
      expect(AdministradorRepository.obtenerClientesActivos).toHaveBeenCalledTimes(1);
    });
  });

  describe("Agregar nuevos producto", () => {
    const productoValido = {
      nombre: "Lentes de sol polarizados",
      descripcion: "Protección UV400, marco en acetato",
      precio: 899.00,
      id_color: 5,
      id_genero: 1,
      id_subcategoria: 8,
      id_marca: 4,
    };

    test("crea producto correctamente con datos válidos", async () => {
      const mockCreado = {
        id: 42,
        ...productoValido,
        activo: true,
      };

      (AdministradorRepository.crearProducto as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [mockCreado],
      } as QueryResult);

      const result = await ProductoService.agregarProducto(productoValido);

      expect(result).toEqual(mockCreado);
      expect(AdministradorRepository.crearProducto).toHaveBeenCalledWith(productoValido);
    });

    test("lanza error si faltan campos obligatorios", async () => {
      const datosIncompletos = {
        nombre: "Solo nombre",
        precio: 450,
      };

      await expect(
        ProductoService.agregarProducto(datosIncompletos)
      ).rejects.toThrow("Faltan campos obligatorios");
    });

    test("lanza error si precio ≤ 0", async () => {
      await expect(
        ProductoService.agregarProducto({
          ...productoValido,
          precio: 0,
        })
      ).rejects.toThrow("El precio debe ser un número mayor a 0");

      await expect(
        ProductoService.agregarProducto({
          ...productoValido,
          precio: -120,
        })
      ).rejects.toThrow("El precio debe ser un número mayor a 0");
    });
  });

  describe("Actualizar informacion de un producto", () => {
    test("actualiza producto correctamente con campos válidos", async () => {
      const datosActualizacion = {
        nombre: "Chamarra Prada Actualizada",
        precio: 999.90,
      };

      const mockActualizado = {
        id: 56,
        nombre: "Chamarra Prada Actualizada",
        precio: 999.90,
        activo: true,
      };

      (AdministradorRepository.actualizarProducto as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [mockActualizado],
      } as QueryResult);

      const result = await ProductoService.actualizarProducto(56, datosActualizacion);

      expect(result).toMatchObject(datosActualizacion);
      expect(AdministradorRepository.actualizarProducto).toHaveBeenCalledWith(56, datosActualizacion);
    });

    test("lanza error si no se envían campos para actualizar", async () => {
      await expect(
        ProductoService.actualizarProducto(56, {})
      ).rejects.toThrow("No se proporcionaron campos para actualizar");
    });
  });

  describe("Eliminar/desactivar producto", () => {
    test("desactiva producto correctamente cuando existe", async () => {
      (AdministradorRepository.desactivarProducto as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 10 }],
      } as QueryResult);

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
      } as unknown as QueryResult);

      await expect(
        ProductoService.eliminarProducto(999)
      ).rejects.toThrow("Producto no encontrado o ya está inactivo");
    });
  });

  describe("Obtener el historial de ventas de cada articulo", () => {
    test("regresa los productos vendidos ordenados descendente por cantidad", async () => {
      const mockVentas = [
        { id_producto: 5, nombre_producto: "Playera oversize", talla: "M", cantidad_total_vendida: 120, numero_pedidos: 45, precio_promedio: 320.50 },
        { id_producto: 8, nombre_producto: "Jeans slim", talla: "32", cantidad_total_vendida: 87, numero_pedidos: 31, precio_promedio: 680.00 },
        { id_producto: 12, nombre_producto: "Tenis running", talla: "27", cantidad_total_vendida: 42, numero_pedidos: 18, precio_promedio: 1450.00 },
      ];

      (AdministradorRepository.obtenerHistorialVentas as jest.Mock).mockResolvedValue({
        rows: mockVentas,
      } as QueryResult);

      const result = await ProductoService.obtenerHistorialVentas();

      expect(result).toEqual(mockVentas);
      expect(AdministradorRepository.obtenerHistorialVentas).toHaveBeenCalledTimes(1);
      expect(result[0].cantidad_total_vendida).toBeGreaterThanOrEqual(result[1].cantidad_total_vendida);
    });

    test("retorna array vacío si no hay ventas", async () => {
      (AdministradorRepository.obtenerHistorialVentas as jest.Mock).mockResolvedValue({
          rows: [],
      } as unknown as QueryResult);

      const result = await ProductoService.obtenerHistorialVentas();

      expect(result).toEqual([]);
    });

    test("propaga error si falla la consulta", async () => {
      (AdministradorRepository.obtenerHistorialVentas as jest.Mock).mockRejectedValue(
        new Error("Error de conexión a base de datos")
      );

      await expect(
        ProductoService.obtenerHistorialVentas()
      ).rejects.toThrow("Error de conexión a base de datos");
    });
  });
});