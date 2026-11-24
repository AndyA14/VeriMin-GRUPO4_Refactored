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

  /** Mínimo de métricas válidas para que χ² sea interpretable. */
  public static readonly MUESTRA_MINIMA = 30;

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

  /**
   * Calcula χ² comparando la distribución del primer dígito de las métricas
   * (vistas, likes, comentarios, compartidos) con la esperada por la Ley de Benford.
   * Ignora valores no numéricos o menores que 1.
   */
  public static desdeMetricas(
    valores: readonly number[],
    critico: number = PruebaBenford.CRITICO_POR_DEFECTO,
  ): Result<PruebaBenford> {
    const conteo: number[] = new Array<number>(9).fill(0);
    let total = 0;

    for (const valor of valores) {
      if (!Number.isFinite(valor) || valor < 1) continue;
      const digito = Number(String(Math.trunc(valor))[0]);
      conteo[digito - 1] = (conteo[digito - 1] ?? 0) + 1;
      total += 1;
    }

    if (total < PruebaBenford.MUESTRA_MINIMA) {
      return Result.fail(
        `Se necesitan al menos ${PruebaBenford.MUESTRA_MINIMA} métricas válidas para aplicar Benford (hay ${total}).`,
      );
    }

    let chi2 = 0;
    for (let d = 1; d <= 9; d += 1) {
      const esperado = total * Math.log10(1 + 1 / d);
      const observado = conteo[d - 1] ?? 0;
      chi2 += (observado - esperado) ** 2 / esperado;
    }

    return PruebaBenford.crear(chi2, critico);
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