import { Result, ValueObject } from '@shared/domain';

interface ContrasenaPropiedades {
  valor: string;
}

/**
 * Value Object: contraseña de acceso.
 * Invariante: mínimo 6 caracteres (regla actual del login).
 */
export class Contrasena extends ValueObject<ContrasenaPropiedades> {
  public static readonly LONGITUD_MINIMA = 6;

  private constructor(propiedades: ContrasenaPropiedades) {
    super(propiedades);
  }

  public static crear(valor: string): Result<Contrasena> {
    if (!valor || valor.length < Contrasena.LONGITUD_MINIMA) {
      return Result.fail(
        `La contraseña debe tener al menos ${Contrasena.LONGITUD_MINIMA} caracteres.`,
      );
    }
    return Result.ok(new Contrasena({ valor }));
  }

  public get valor(): string {
    return this.props.valor;
  }
}