import { CasoDeUso } from '@shared/application';
import { Result } from '@shared/domain';
import { Contrasena, Email, RepositorioUsuarioPort, Usuario } from '../domain';

export interface IniciarSesionEntrada {
  email: string;
  clave: string;
}

export interface UsuarioSesion {
  id: string;
  email: string;
  nombre: string;
}

/**
 * Caso de uso: iniciar sesión.
 * Prototipo sin backend: si el usuario no existe, se registra al primer acceso.
 */
export class IniciarSesion implements CasoDeUso<IniciarSesionEntrada, UsuarioSesion> {
  constructor(private readonly repositorio: RepositorioUsuarioPort) {}

  public async ejecutar(entrada: IniciarSesionEntrada): Promise<Result<UsuarioSesion>> {
    const email = Email.crear(entrada.email);
    if (email.esFallo) return Result.fail(email.error);

    const contrasena = Contrasena.crear(entrada.clave);
    if (contrasena.esFallo) return Result.fail(contrasena.error);

    let usuario = await this.repositorio.buscarPorEmail(email.valor);
    if (!usuario) {
      const nuevo = Usuario.registrar(email.valor);
      if (nuevo.esFallo) return Result.fail(nuevo.error);
      usuario = nuevo.valor;
      await this.repositorio.guardar(usuario);
    }

    return Result.ok({
      id: usuario.id,
      email: usuario.email.valor,
      nombre: usuario.nombre,
    });
  }
}