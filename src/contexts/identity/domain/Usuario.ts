import { Entity, Result } from '@shared/domain';
import { Email } from './Email';

interface UsuarioPropiedades {
  email: Email;
  nombre: string;
}

/**
 * Entidad: usuario que accede a VeriMind.
 * Su identidad es el `id`; el nombre se deriva del correo corporativo.
 */
export class Usuario extends Entity<UsuarioPropiedades> {
  private constructor(id: string, propiedades: UsuarioPropiedades) {
    super(id, propiedades);
  }

  public static registrar(email: Email): Result<Usuario> {
    return Result.ok(
      new Usuario(email.valor, { email, nombre: Usuario.nombreDesde(email) }),
    );
  }

  /** "ana.perez@empresa.com" -> "Ana" */
  private static nombreDesde(email: Email): string {
    const local = email.valor.split('@')[0] ?? '';
    const primera = local.split(/[._\-+0-9]+/).filter(Boolean)[0] ?? '';
    if (!primera) return 'Usuario';
    return primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase();
  }

  public get email(): Email {
    return this.props.email;
  }

  public get nombre(): string {
    return this.props.nombre;
  }
}