import { Result, ValueObject } from '@shared/domain';

interface EmailPropiedades {
  direccion: string;
}

/**
 * Value Object: correo corporativo de un usuario.
 * Invariante: formato válido; se normaliza a minúsculas y sin espacios.
 */
export class Email extends ValueObject<EmailPropiedades> {
  private constructor(propiedades: EmailPropiedades) {
    super(propiedades);
  }

  public static crear(valor: string): Result<Email> {
    const limpio = (valor ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpio)) {
      return Result.fail('Ingresa un correo corporativo válido.');
    }
    return Result.ok(new Email({ direccion: limpio }));
  }

  public get valor(): string {
    return this.props.direccion;
  }
}