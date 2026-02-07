/**
 * Pruebas unitarias para AuthService
 * Equipo: ---
 * Autor: Abdiel
 * Fecha: 2026
 */

import { AuthService } from "@/services/AuthService";
import { ClienteRepository } from "@/repositories/ClienteRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =====================
// MOCKS
// =====================
jest.mock("@/repositories/ClienteRepository", () => ({
  ClienteRepository: {
    existsByCorreo: jest.fn(),
    create: jest.fn(),
    findByCorreo: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deactivateById: jest.fn(),
  },
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================================
  // REGISTER
  // ======================================
  describe("register", () => {
    test("crea usuario correctamente cuando el correo no existe", async () => {
      (ClienteRepository.existsByCorreo as jest.Mock).mockResolvedValue({ rows: [] });
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed123");
      (ClienteRepository.create as jest.Mock).mockResolvedValue(undefined);

      await AuthService.register({
        nombre: "Test",
        apellidos: "Usuario",
        correo: "test@test.com",
        contrasena: "123456",
        telefono: "9510000000",
      });

      expect(ClienteRepository.existsByCorreo).toHaveBeenCalledWith("test@test.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(ClienteRepository.create).toHaveBeenCalled();
    });

    test("lanza error si correo ya existe", async () => {
      (ClienteRepository.existsByCorreo as jest.Mock).mockResolvedValue({
        rows: [{ id: 1 }],
      });

      await expect(
        AuthService.register({
          correo: "test@test.com",
          contrasena: "123456",
        })
      ).rejects.toThrow("El correo ya está registrado");
    });
  });

  // ======================================
  // LOGIN
  // ======================================
  describe("login", () => {
    test("retorna token si credenciales correctas", async () => {
      (ClienteRepository.findByCorreo as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, correo: "test@test.com", contrasena: "hashed123" }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake-token-jwt");

      const token = await AuthService.login("test@test.com", "123456");

      expect(token).toBe("fake-token-jwt");
      expect(jwt.sign).toHaveBeenCalled();
    });

    test("error si usuario no existe", async () => {
      (ClienteRepository.findByCorreo as jest.Mock).mockResolvedValue({ rows: [] });

      await expect(AuthService.login("no@test.com", "123456")).rejects.toThrow(
        "Usuario no encontrado"
      );
    });

    test("error si contraseña incorrecta", async () => {
      (ClienteRepository.findByCorreo as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, correo: "test@test.com", contrasena: "hashed123" }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.login("test@test.com", "badpass")).rejects.toThrow(
        "Contraseña incorrecta"
      );
    });
  });

  // ======================================
  // OBTENER PERFIL
  // ======================================
  describe("obtenerPerfil", () => {
    test("devuelve perfil sin la contraseña cuando existe", async () => {
      const mockPerfil = {
        id: 5,
        nombre: "Luis",
        apellidos: "García",
        correo: "luis@test.com",
        telefono: "9511111111",
        foto_perfil: "foto.jpg",
        contrasena: "hash-no-visible",
      };

      (ClienteRepository.findById as jest.Mock).mockResolvedValue({ rows: [mockPerfil] });

      const perfil = await AuthService.obtenerPerfil(5);

      expect(perfil.contrasena).toBeUndefined();
      expect(perfil.nombre).toBe("Luis");
      expect(perfil.correo).toBe("luis@test.com");
      expect(ClienteRepository.findById).toHaveBeenCalledWith(5);
    });

    test("lanza error si cliente no existe o está inactivo", async () => {
      (ClienteRepository.findById as jest.Mock).mockResolvedValue({ rows: [] });

      await expect(AuthService.obtenerPerfil(999)).rejects.toThrow(
        "Cliente no encontrado o cuenta inactiva"
      );
    });
  });

  // ======================================
  // ACTUALIZAR PERFIL
  // ======================================
  describe("actualizarPerfil", () => {
    test("actualiza campos básicos correctamente", async () => {
      const datos = { nombre: "NuevoNombre", telefono: "9519999999" };

      (ClienteRepository.findById as jest.Mock).mockResolvedValue({
        rows: [{ id: 5, correo: "luis@test.com" }],
      });
      (ClienteRepository.existsByCorreo as jest.Mock).mockResolvedValue({ rows: [] });
      (ClienteRepository.updateById as jest.Mock).mockResolvedValue(undefined);

      await AuthService.actualizarPerfil(5, datos);

      expect(ClienteRepository.updateById).toHaveBeenCalledWith(5, expect.objectContaining(datos));
    });

    test("rechaza cambio de correo si ya existe", async () => {
      (ClienteRepository.findById as jest.Mock).mockResolvedValue({
        rows: [{ id: 5, correo: "luis@test.com" }],
      });
      (ClienteRepository.existsByCorreo as jest.Mock).mockResolvedValue({
        rows: [{ id: 10 }],
      });

      await expect(
        AuthService.actualizarPerfil(5, { correo: "otro@ocupado.com" })
      ).rejects.toThrow("El correo ya está registrado");
    });

    test("requiere contraseña actual para cambiar contraseña", async () => {
      await expect(
        AuthService.actualizarPerfil(5, { nueva_contrasena: "nueva123" })
      ).rejects.toThrow("Debes proporcionar la contraseña actual");
    });
  });

  // ======================================
  // DESACTIVAR CUENTA
  // ======================================
  describe("desactivarCuenta", () => {
    test("desactiva cuenta correctamente", async () => {
      (ClienteRepository.deactivateById as jest.Mock).mockResolvedValue({ rowCount: 1 });

      await AuthService.desactivarCuenta(5);

      expect(ClienteRepository.deactivateById).toHaveBeenCalledWith(5);
    });

    test("lanza error si no se pudo desactivar (no existe o ya desactivada)", async () => {
      (ClienteRepository.deactivateById as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(AuthService.desactivarCuenta(999)).rejects.toThrow(
        "Cuenta no encontrada o ya está desactivada"
      );
    });
  });
});