/**
 * ============================================================================
 * SHARED KERNEL - DOMINIO: EVENTO DE DOMINIO (DomainEvent)
 * ============================================================================
 *
 * ¿QUÉ ES Y POR QUÉ EXISTE EN DDD?
 * Un Evento de Dominio (Domain Event) representa algo significativo que ya ha
 * ocurrido en el pasado dentro del dominio del negocio.
 *
 * CARACTERÍSTICAS PRINCIPALES:
 * 1. Hecho Inmutable: Dado que representa algo que ya sucedió, un evento jamás
 *    puede modificarse o destruirse.
 * 2. Comunicación Desacoplada: Permite la integración entre diferentes Bounded
 *    Contexts (ej. `analisis` -> `facturacion`) sin que exista acoplamiento directo
 *    entre sus modelos de datos.
 * 3. Trazabilidad y Auditoría: Facilita el registro cronológico de operaciones
 *    clave para cumplimiento, métricas y proyecciones.
 *
 * ¿CÓMO DEBEN USARLA LOS DESARROLLADORES EN LOS BOUNDED CONTEXTS?
 * Implemente esta interfaz o extienda la clase base al disparar eventos de dominio:
 *
 * @example
 * ```typescript
 * export class UsuarioRegistradoEvento implements DomainEvent {
 *   public readonly occurredOn: Date;
 *   public readonly aggregateId: string;
 *   public readonly email: string;
 *
 *   constructor(usuarioId: string, email: string) {
 *     this.occurredOn = new Date();
 *     this.aggregateId = usuarioId;
 *     this.email = email;
 *   }
 * }
 * ```
 */

export interface DomainEvent {
  /**
   * Marca temporal exacta en la que se produjo el evento de dominio.
   */
  readonly occurredOn: Date;

  /**
   * Identificador único de la Entidad o Agregado Raíz que originó el evento.
   */
  readonly aggregateId: string;

  /**
   * Nombre único del evento de dominio, útil para suscripción y enrutamiento en un Event Bus.
   */
  readonly eventName?: string;
}

/**
 * Clase base opcional para estandarizar la creación de eventos de dominio inmutables.
 */
export abstract class DomainEventBase implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: string;
  public readonly eventName?: string;

  /**
   * Inicializa un evento de dominio base registrando la fecha y hora actual si no se provee.
   *
   * @param aggregateId Identificador de la entidad o agregado raíz emisor.
   * @param eventName Nombre opcional descriptivo del evento de negocio.
   * @param occurredOn Fecha del evento (por defecto `new Date()`).
   */
  protected constructor(aggregateId: string, eventName?: string, occurredOn: Date = new Date()) {
    if (!aggregateId || typeof aggregateId !== 'string') {
      throw new Error('Todo evento de dominio debe estar asociado al aggregateId emisor.');
    }
    this.aggregateId = aggregateId;
    this.eventName = eventName;
    this.occurredOn = occurredOn;
    Object.freeze(this);
  }
}

/**
 * Alias de tipo e interfaz en español para enriquecer el Lenguaje Ubicuo.
 */
export type EventoDominio = DomainEvent;
export const EventoDominioBase = DomainEventBase;
