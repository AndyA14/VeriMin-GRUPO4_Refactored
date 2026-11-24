/**
 * ============================================================================
 * SHARED KERNEL - DOMINIO: ENTIDAD (Entity)
 * ============================================================================
 *
 * ¿QUÉ ES Y POR QUÉ EXISTE EN DDD?
 * En el Diseño Guiado por el Dominio (DDD), una Entidad es un objeto de negocio
 * que se define principalmente por su identidad única y su continuidad conceptual
 * a lo largo del tiempo, y no meramente por los atributos que contiene.
 *
 * DIFERENCIA FUNDAMENTAL FRENTE A UN VALUE OBJECT (OBJETO DE VALOR):
 * 1. Identidad:
 *    - La Entidad posee un identificador explícito (`id`). Dos entidades con
 *      exactamente los mismos atributos pero diferente `id` son consideradas
 *      DISTINTAS en el dominio.
 *    - El Value Object no tiene identidad propia; dos instancias con los mismos
 *      atributos son idénticas e intercambiables.
 * 2. Ciclo de Vida y Mutabilidad:
 *    - La Entidad evoluciona a lo largo del tiempo; sus propiedades pueden
 *      cambiar mediante métodos de negocio (comportamiento rico) manteniendo
 *      su mismo `id`.
 *    - El Value Object es 100% inmutable (`Object.freeze`); cualquier cambio
 *      requiere instanciar un nuevo Value Object.
 *
 * ¿CÓMO DEBEN USARLA LOS DESARROLLADORES EN LOS BOUNDED CONTEXTS?
 * Al modelar conceptos como un `Usuario` en el contexto `identity`, un `Analisis`
 * en `analisis`, o una `Factura` en `facturacion`, extienda esta clase base:
 *
 * @example
 * ```typescript
 * interface UsuarioPropiedades {
 *   nombre: string;
 *   correo: string;
 *   activo: boolean;
 * }
 *
 * export class Usuario extends Entity<UsuarioPropiedades> {
 *   private constructor(id: string, props: UsuarioPropiedades) {
 *     super(id, props);
 *   }
 *
 *   public static crear(id: string, props: UsuarioPropiedades): Result<Usuario> {
 *     return Result.ok(new Usuario(id, props));
 *   }
 *
 *   public desactivar(): void {
 *     this.props.activo = false;
 *   }
 * }
 * ```
 */

export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly propiedades: T;

  /**
   * Inicializa una nueva entidad con su identificador único y propiedades de estado.
   *
   * @param id Identificador único invariable de la entidad (ej. UUID, NanoID o ID de base de datos).
   * @param propiedades Atributos de negocio que representan el estado actual de la entidad.
   */
  protected constructor(id: string, propiedades: T) {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Toda entidad de dominio debe poseer un identificador único válido (id no vacío).');
    }
    this._id = id;
    this.propiedades = propiedades;
  }

  /**
   * Obtiene el identificador único de la entidad.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Acceso protegido a las propiedades internas para que las clases hijas
   * implementen sus reglas de negocio y mutaciones controladas.
   */
  protected get props(): T {
    return this.propiedades;
  }

  /**
   * Compara dos entidades basándose exclusivamente en su identidad única (`id`).
   *
   * En DDD, dos entidades son iguales si y solo si comparten el mismo identificador,
   * sin importar si sus demás atributos difieren.
   *
   * @param objeto Entidad candidata a comparar.
   * @returns `true` si ambas entidades comparten el mismo `id`; `false` en caso contrario.
   */
  public equals(objeto?: Entity<T> | null): boolean {
    if (objeto === null || objeto === undefined) {
      return false;
    }

    if (this === objeto) {
      return true;
    }

    if (!(objeto instanceof Entity)) {
      return false;
    }

    return this._id === objeto._id;
  }

  /**
   * Alias en español para el método `equals` (favorece el Lenguaje Ubicuo).
   *
   * @param objeto Entidad candidata a comparar.
   */
  public esIgual(objeto?: Entity<T> | null): boolean {
    return this.equals(objeto);
  }
}

/**
 * Alias de tipo en español para enriquecer el Lenguaje Ubicuo del dominio.
 */
export type Entidad<T> = Entity<T>;
