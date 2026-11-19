/**
 * ============================================================================
 * SHARED KERNEL - DOMINIO: OBJETO DE VALOR (ValueObject)
 * ============================================================================
 *
 * ¿QUÉ ES Y POR QUÉ EXISTE EN DDD?
 * En el Diseño Guiado por el Dominio (DDD), un Objeto de Valor (Value Object) es un
 * concepto de negocio que describe una propiedad, cantidad o aspecto medible
 * sin poseer una identidad conceptual propia en el sistema.
 *
 * CARACTERÍSTICAS VITALES DE UN VALUE OBJECT:
 * 1. Inmutabilidad Estricta:
 *    Una vez creado, su valor jamás puede modificarse. Para reflejar un cambio,
 *    se debe crear una nueva instancia. Esta clase aplica `Object.freeze` sobre
 *    sus propiedades y sobre sí misma para garantizar esta invariante en tiempo de ejecución.
 * 2. Igualdad Estructural:
 *    Dos Objetos de Valor se consideran idénticos si todas y cada una de sus
 *    propiedades internas tienen los mismos valores. No importa su referencia en memoria.
 * 3. Auto-validación de Invariantes:
 *    Un Value Object no puede existir en un estado inválido. La validación se
 *    realiza normalmente en un método fábrica estático (`crear(...)`) retornando `Result`.
 *
 * DIFERENCIA FRENTE A UNA ENTIDAD:
 * Los Value Objects no tienen `id`. Dos monedas de $10 USD son exactamente iguales
 * e intercambiables entre sí. En cambio, dos usuarios con el mismo nombre siguen
 * siendo dos entidades distintas con identidades (`id`) separadas.
 *
 * ¿CÓMO DEBEN USARLA LOS DESARROLLADORES EN LOS BOUNDED CONTEXTS?
 * Extienda esta clase para tipos como `CorreoElectronico`, `ContrasenaHash` (en `identity`),
 * `MontoDinero` (en `facturacion`) o `PuntajeRiesgo` (en `analisis`):
 *
 * @example
 * ```typescript
 * interface CorreoPropiedades {
 *   direccion: string;
 * }
 *
 * export class CorreoElectronico extends ValueObject<CorreoPropiedades> {
 *   private constructor(props: CorreoPropiedades) {
 *     super(props);
 *   }
 *
 *   public static crear(correo: string): Result<CorreoElectronico> {
 *     if (!correo || !correo.includes('@')) {
 *       return Result.fail('El formato del correo electrónico no es válido.');
 *     }
 *     return Result.ok(new CorreoElectronico({ direccion: correo.trim().toLowerCase() }));
 *   }
 *
 *   public get valor(): string {
 *     return this.props.direccion;
 *   }
 * }
 * ```
 */

export abstract class ValueObject<T extends Record<string, any>> {
  protected readonly propiedades: Readonly<T>;

  /**
   * Inicializa el Objeto de Valor e impone inmutabilidad profunda sobre sus propiedades.
   *
   * @param propiedades Objeto plano que contiene los atributos del Value Object.
   */
  protected constructor(propiedades: T) {
    if (!propiedades || typeof propiedades !== 'object' || Array.isArray(propiedades)) {
      throw new Error('Las propiedades de un ValueObject deben ser un objeto válido.');
    }

    // Clonamos superficialmente y congelamos para evitar mutaciones externas posteriores
    this.propiedades = Object.freeze({ ...propiedades });
    Object.freeze(this);
  }

  /**
   * Acceso de solo lectura a las propiedades internas del Objeto de Valor.
   */
  public get props(): Readonly<T> {
    return this.propiedades;
  }

  /**
   * Evalúa la igualdad estructural entre dos Objetos de Valor.
   *
   * En DDD, dos Value Objects son iguales si y solo si todas sus propiedades
   * y valores coinciden estructuralmente, sin depender de identidad de referencia.
   *
   * @param vo Objeto de Valor candidato a comparar.
   * @returns `true` si todas las propiedades coinciden estructuralmente; `false` si difieren.
   */
  public equals(vo?: ValueObject<T> | null): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (this === vo) {
      return true;
    }

    if (!(vo instanceof ValueObject)) {
      return false;
    }

    return this.compararEstructuralmente(this.propiedades, vo.propiedades);
  }

  /**
   * Alias en español para el método `equals` (favorece el Lenguaje Ubicuo).
   *
   * @param vo Objeto de Valor candidato a comparar.
   */
  public esIgual(vo?: ValueObject<T> | null): boolean {
    return this.equals(vo);
  }

  /**
   * Comparación recursiva profunda y determinista para verificar igualdad de propiedades.
   */
  private compararEstructuralmente(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
      return false;
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    const clavesA = Object.keys(a);
    const clavesB = Object.keys(b);

    if (clavesA.length !== clavesB.length) {
      return false;
    }

    for (const clave of clavesA) {
      if (!Object.prototype.hasOwnProperty.call(b, clave)) {
        return false;
      }
      if (!this.compararEstructuralmente(a[clave], b[clave])) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Alias de tipo en español para enriquecer el Lenguaje Ubicuo del dominio.
 */
export type ObjetoDeValor<T extends Record<string, any>> = ValueObject<T>;
