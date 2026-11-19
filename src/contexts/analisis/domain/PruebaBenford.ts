import { Result, ValueObject } from '@shared/domain';

interface PruebaBenfordPropiedades {
  chi2: number;
  critico: number;
}

/**
 * Resultado de la Ley de Benford sobre las interacciones de una cuenta.
 * Es un indicio estadístico, no una prueba de fraude.
 */
export class PruebaBenford extends ValueObject<PruebaBenfordPropiedades> {
  /** Valor crítico de χ² con 8 grados de libertad (dígitos 1 a 9) y 1 % de significancia. */
  public static readonly CRITICO_POR_DEFECTO = 20.09;

  private constructor(propiedades: PruebaBenfordPropiedades) {
    super(propiedades);
  }

  public static crear(
    chi2: number,
    critico: number = PruebaBenford.CRITICO_POR_DEFECTO,
  ): Result<PruebaBenford> {
    if (!Number.isFinite(chi2) || chi2 < 0) {
      return Result.fail('El valor de χ² debe ser un número mayor o igual a cero.');
    }
    if (!Number.isFinite(critico) || critico <= 0) {
      return Result.fail('El valor crítico debe ser un número mayor que cero.');
    }
    return Result.ok(new PruebaBenford({ chi2, critico }));
  }

  public get chi2(): number {
    return this.props.chi2;
  }

  public get critico(): number {
    return this.props.critico;
  }

  /** Hay anomalía cuando χ² supera el valor crítico. */
  public get esAnomala(): boolean {
    return this.props.chi2 > this.props.critico;
  }
}