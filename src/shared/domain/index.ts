/**
 * ============================================================================
 * SHARED KERNEL - DOMINIO (BARREL EXPORT)
 * ============================================================================
 *
 * Exportación centralizada de todos los bloques fundamentales del Shared Kernel
 * de Dominio: Entidades, Objetos de Valor, Resultados y Eventos de Dominio.
 *
 * Los diferentes Bounded Contexts (`analisis`, `identity`, `facturacion`) deben
 * consumir estos contratos a través del alias `@shared/domain`.
 */

export * from './Entity';
export * from './ValueObject';
export * from './Result';
export * from './DomainEvent';
