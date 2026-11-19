import { Email, RepositorioUsuarioPort, Usuario } from '../domain';

/** Adaptador de salida: guarda usuarios en memoria (se pierde al cerrar la app). */
export class RepositorioUsuarioEnMemoria implements RepositorioUsuarioPort {
  private readonly usuarios = new Map<string, Usuario>();

  public async buscarPorEmail(email: Email): Promise<Usuario | null> {
    return this.usuarios.get(email.valor) ?? null;
  }

  public async guardar(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.email.valor, usuario);
  }
}
