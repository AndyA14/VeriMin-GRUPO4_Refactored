import { Result, ValueObject } from '@shared/domain';

interface HandlePropiedades {
  valor: string;
}

/**
 * @usuario público de TikTok ya limpio: sin espacios y con un solo "@" al inicio.
 */
export class Handle extends ValueObject<HandlePropiedades> {
  private constructor(propiedades: HandlePropiedades) {
    super(propiedades);
  }

  public static crear(texto: string): Result<Handle> {
    const limpio = (texto ?? '').trim().replace(/^@+/, '').replace(/\s+/g, '');
    if (!limpio) {
      return Result.fail('Ingresa un @usuario público de TikTok.');
    }
    return Result.ok(new Handle({ valor: `@${limpio}` }));
  }

  public get valor(): string {
    return this.props.valor;
  }
}