//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 06/02/2026 */
//**********/
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ClienteRepository } from "@/repositories/cliente/cliente.repository";

export class AuthService {

  static async register(data: any) {

    const exists = await ClienteRepository.existsByCorreo(data.correo);

    if (exists.rows.length > 0) {
      throw new Error("El correo ya está registrado");
    }

    const hash = await bcrypt.hash(data.contrasena, 10);

    const user = await ClienteRepository.create({
      ...data,
      contrasena: hash
    });

    return user.rows[0];
  }

  static async login(correo: string, contrasena: string) {

    const result = await ClienteRepository.findByCorreo(correo);

    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(contrasena, user.contrasena);

    if (!match) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      {
        id: user.id,
        correo: user.correo,
        rol: user.id_rol
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    return token;
  }

  //***********/
  //* Nombre del equipo: Equipo 1 */
  //* Autor de la clase: Ramos Bello Jose Luis */
  //* Fecha: 06/02/2026 */
  //**********/

  /* =====================
       OBTENER PERFIL
    ===================== */
  static async obtenerPerfil(usuarioId: number) {
    const result = await ClienteRepository.findById(usuarioId);

    if (!result) {
      throw new Error("Usuario no encontrado o cuenta inactiva");
    }

    const { contrasena, ...perfil } = result;
    return perfil;
  }

  /* =====================
     ACTUALIZAR PERFIL
  ===================== */
  static async actualizarPerfil(usuarioId: number, datos: {
    nombre?: string;
    apellidos?: string;
    telefono?: string;
    foto_perfil?: string | null;
    correo?: string;
    contrasena_actual?: string;
    nueva_contrasena?: string;
  }) {
    const updates: Partial<typeof datos> = {};

    if (datos.nombre !== undefined) updates.nombre = datos.nombre;
    if (datos.apellidos !== undefined) updates.apellidos = datos.apellidos;
    if (datos.telefono !== undefined) updates.telefono = datos.telefono;
    if (datos.foto_perfil !== undefined) updates.foto_perfil = datos.foto_perfil;

    if (datos.correo) {
      const existe = await ClienteRepository.existsByCorreo(datos.correo);

      if (existe) {
        const usuarioActual = await ClienteRepository.findById(usuarioId);
        if (usuarioActual?.correo !== datos.correo) {
          throw new Error("El correo ya está registrado por otra cuenta");
        }
      }
      updates.correo = datos.correo;
    }

    if (datos.nueva_contrasena) {
      if (!datos.contrasena_actual) {
        throw new Error("Debes proporcionar la contraseña actual para cambiarla");
      }

      const usuario = await ClienteRepository.findById(usuarioId);
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      const match = await bcrypt.compare(datos.contrasena_actual, usuario.contrasena);
      if (!match) {
        throw new Error("La contraseña actual es incorrecta");
      }

      updates.nueva_contrasena = await bcrypt.hash(datos.nueva_contrasena, 10);
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No se proporcionaron campos para actualizar");
    }

    const usuarioActualizado = await ClienteRepository.updateById(usuarioId, updates);

    if (!usuarioActualizado) {
      throw new Error("No se pudo actualizar el perfil (usuario no encontrado o inactivo)");
    }

    const { contrasena, ...perfilActualizado } = usuarioActualizado;
    return perfilActualizado;
  }

  /* =====================
     DESACTIVAR CUENTA
  ===================== */
  static async desactivarCuenta(usuarioId: number) {
    const result = await ClienteRepository.deactivateById(usuarioId);

    if (!result) {
      throw new Error("Cuenta no encontrada o ya está desactivada");
    }

    return { message: "Cuenta desactivada correctamente" };
  }

}