import { Result, ValueObject } from '@shared/domain';

export type CategoriaRiesgo = 'bajo' | 'medio' | 'elevado';

interface NivelRiesgoPropiedades {
  porcentaje: number;
}

/**
 * Nivel de riesgo de una cuenta, de 0 a 100 %. Es un indicio, no un diagnóstico.
 */
export class NivelRiesgo extends ValueObject<NivelRiesgoPropiedades> {
  /** Desde este porcentaje el riesgo se considera medio. */
  public static readonly UMBRAL_MEDIO = 35;
  /** Desde este porcentaje el riesgo se considera elevado. */
  public static readonly UMBRAL_ELEVADO = 65;

  private constructor(propiedades: NivelRiesgoPropiedades) {
    super(propiedades);
  }

  public static crear(porcentaje: number): Result<NivelRiesgo> {
    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      return Result.fail('El porcentaje de riesgo debe estar entre 0 y 100.');
    }
    return Result.ok(new NivelRiesgo({ porcentaje: Math.round(porcentaje) }));
  }

  public get porcentaje(): number {
    return this.props.porcentaje;
  }

  public get categoria(): CategoriaRiesgo {
    if (this.props.porcentaje >= NivelRiesgo.UMBRAL_ELEVADO) return 'elevado';
    if (this.props.porcentaje >= NivelRiesgo.UMBRAL_MEDIO) return 'medio';
    return 'bajo';
  }

  /** Texto que se muestra en pantalla, por ejemplo: "Riesgo elevado · 78 %". */
  public get etiqueta(): string {
    return `Riesgo ${this.categoria} · ${this.props.porcentaje} %`;
  }
}