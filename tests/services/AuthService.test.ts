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
    findByCorreo: jest.fn()
  }
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

  test("register → crea usuario correctamente", async () => {

    (ClienteRepository.existsByCorreo as any).mockResolvedValue({ rows: [] });

    (bcrypt.hash as any).mockResolvedValue("hashed123");

    await AuthService.register({
      correo: "test@test.com",
      contrasena: "123456"
    });

    expect(ClienteRepository.create).toHaveBeenCalled();
  });


  test("register → lanza error si correo ya existe", async () => {

    (ClienteRepository.existsByCorreo as any).mockResolvedValue({
      rows: [{ id: 1 }]
    });

    await expect(
      AuthService.register({
        correo: "test@test.com",
        contrasena: "123456"
      })
    ).rejects.toThrow("El correo ya está registrado");
  });


  // ======================================
  // LOGIN
  // ======================================

  test("login → retorna token si credenciales correctas", async () => {

    (ClienteRepository.findByCorreo as any).mockResolvedValue({
      rows: [
        { id: 1, correo: "test@test.com", contrasena: "hashed123" }
      ]
    });

    (bcrypt.compare as any).mockResolvedValue(true);

    (jwt.sign as any).mockReturnValue("fake-token");

    const token = await AuthService.login("test@test.com", "123456");

    expect(token).toBe("fake-token");
  });


  test("login → error si usuario no existe", async () => {

    (ClienteRepository.findByCorreo as any).mockResolvedValue({ rows: [] });

    await expect(
      AuthService.login("no@test.com", "123456")
    ).rejects.toThrow("Usuario no encontrado");
  });


  test("login → error si contraseña incorrecta", async () => {

    (ClienteRepository.findByCorreo as any).mockResolvedValue({
      rows: [
        { id: 1, correo: "test@test.com", contrasena: "hashed123" }
      ]
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(
      AuthService.login("test@test.com", "badpass")
    ).rejects.toThrow("Contraseña incorrecta");
  });

});
