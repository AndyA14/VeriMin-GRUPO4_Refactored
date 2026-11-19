/**
 * ============================================================================
 * SHARED KERNEL - DOMINIO: PATRÓN RESULT (Result)
 * ============================================================================
 *
 * ¿QUÉ ES Y POR QUÉ EXISTE EN DDD Y ARQUITECTURA HEXAGONAL?
 * En el diseño de software robusto, las excepciones (`throw new Error(...)`)
 * deben reservarse para fallos inesperados del sistema (ej. caída de red,
 * fallo de hardware o errores fatales de infraestructura).
 *
 * Los fallos de negocio (ej. saldo insuficiente, formato de email inválido,
 * credenciales incorrectas) NO son excepciones: son flujos alternativos esperados
 * del modelo de dominio.
 *
 * El patrón `Result<T, E>` modela explícitamente el resultado de una operación:
 * - Si es exitosa, contiene el valor de retorno de tipo `T`.
 * - Si falla, contiene un error descriptivo de negocio de tipo `E` (por defecto `string`).
 *
 * BENEFICIOS:
 * 1. Seguridad de Tipos: El compilador obliga al consumidor a verificar si la
 *    operación fue exitosa antes de acceder al valor (`isSuccess` o `isFailure`).
 * 2. Transparencia: La firma de la función comunica explícitamente que puede fallar.
 * 3. Dominio Puro: Evita bloques `try/catch` engorrosos en casos de uso y servicios.
 *
 * ¿CÓMO DEBEN USARLA LOS DESARROLLADORES EN LOS BOUNDED CONTEXTS?
 * @example
 * ```typescript
 * function transferirDinero(origen: Cuenta, destino: Cuenta, monto: number): Result<void, string> {
 *   if (origen.saldo < monto) {
 *     return Result.fail('Saldo insuficiente para completar la transferencia.');
 *   }
 *   origen.debitar(monto);
 *   destino.acreditar(monto);
 *   return Result.ok();
 * }
 * ```
 */

export class Result<T, E = string> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  /**
   * Constructor privado. Para instanciar un resultado se debe utilizar
   * `Result.ok(...)` o `Result.fail(...)`.
   */
  private constructor(isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error !== undefined) {
      throw new Error('Invariante violada: Un Result exitoso no puede contener un error.');
    }
    if (!isSuccess && error === undefined) {
      throw new Error('Invariante violada: Un Result fallido debe contener un error.');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  /**
   * Obtiene el valor exitoso contenido en el resultado.
   * Lanza un error si se intenta acceder a un valor en un resultado fallido.
   */
  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('No es posible obtener el valor de un Result fallido. Verifique isSuccess primero.');
    }
    return this._value as T;
  }

  /**
   * Obtiene el error de negocio contenido en el resultado.
   * Lanza un error si se intenta acceder a un error en un resultado exitoso.
   */
  public getError(): E {
    if (this.isSuccess) {
      throw new Error('No es posible obtener el error de un Result exitoso.');
    }
    return this._error as E;
  }

  // ==========================================================================
  // Propiedades y métodos en español (Lenguaje Ubicuo)
  // ==========================================================================

  /**
   * Indica si la operación culminó con éxito.
   */
  public get esExitoso(): boolean {
    return this.isSuccess;
  }

  /**
   * Indica si la operación resultó en un fallo de negocio.
   */
  public get esFallo(): boolean {
    return this.isFailure;
  }

  /**
   * Alias en español para obtener el valor exitoso.
   */
  public get valor(): T {
    return this.getValue();
  }

  /**
   * Alias en español para obtener el error de negocio.
   */
  public get error(): E {
    return this.getError();
  }

  // ==========================================================================
  // Métodos fábrica estáticos
  // ==========================================================================

  /**
   * Fabrica un resultado exitoso que encapsula un valor.
   *
   * @param value Valor de éxito resultante de la operación.
   */
  public static ok<U, F = string>(value?: U): Result<U, F> {
    return new Result<U, F>(true, undefined, value);
  }

  /**
   * Fabrica un resultado fallido que encapsula un error de negocio.
   *
   * @param error Error o motivo del fallo.
   */
  public static fail<U, F = string>(error: F): Result<U, F> {
    return new Result<U, F>(false, error);
  }

  /**
   * Alias en español para `Result.ok`.
   */
  public static exito<U, F = string>(valor?: U): Result<U, F> {
    return Result.ok<U, F>(valor);
  }

  /**
   * Alias en español para `Result.fail`.
   */
  public static fallo<U, F = string>(error: F): Result<U, F> {
    return Result.fail<U, F>(error);
  }

  /**
   * Combina múltiples resultados. Si cualquiera de ellos es un fallo, retorna el primer fallo hallado.
   * Si todos son exitosos, retorna `Result.ok()`.
   *
   * @param results Arreglo de resultados a evaluar.
   */
  public static combine<E = string>(results: Result<any, E>[]): Result<void, E> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<void, E>(result.getError());
      }
    }
    return Result.ok<void, E>();
  }
}

/**
 * Alias de tipo en español para enriquecer el Lenguaje Ubicuo del dominio.
 */
export type Resultado<T, E = string> = Result<T, E>;
