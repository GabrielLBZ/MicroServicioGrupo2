import { ActualizarUsuario, CrearUsuario } from "../models/user.model";
import { UsuariosRepository } from "../repositorys/user.repository";

export class UsuariosService {
  static async obtenerTodos() {
    return await UsuariosRepository.obtenerTodos();
  }

  static async obtenerPorId(id: string) {
    return await UsuariosRepository.obtenerPorId(id);
  }

  static async crear(usuario: CrearUsuario) {
    return await UsuariosRepository.crear(usuario);
  }

  static async actualizar(id: string, usuario: ActualizarUsuario) {
    return await UsuariosRepository.actualizar(id, usuario);
  }

  static async eliminar(id: string) {
    return await UsuariosRepository.eliminar(id);
  }
}
