/**
 * ============================================================================
 * SHARED KERNEL - APLICACIÓN: CONTRATO BASE DE CASO DE USO (CasoDeUso / UseCase)
 * ============================================================================
 *
 * ¿QUÉ ES Y POR QUÉ EXISTE EN LA ARQUITECTURA HEXAGONAL?
 * La capa de Aplicación contiene la lógica de casos de uso del sistema. Su rol es
 * orquestar el flujo de datos hacia y desde las entidades del Dominio, coordinando
 * los Puertos de Salida (repositorios, servicios externos, buses de eventos)
 * sin acoplarse a detalles de infraestructura (bases de datos, frameworks UI, APIs).
 *
 * Cada Caso de Uso representa una única acción de negocio que un actor o sistema
 * puede realizar (Principio de Responsabilidad Única - SRP).
 *
 * ¿CÓMO DEBEN USARLA LOS DESARROLLADORES EN LOS BOUNDED CONTEXTS?
 * Implemente esta interfaz en cada caso de uso de `analisis/application`,
 * `identity/application` o `facturacion/application`:
 *
 * @example
 * ```typescript
 * export interface IniciarSesionDTO {
 *   email: string;
 *   clave: string;
 * }
 *
 * export class IniciarSesionCasoDeUso implements CasoDeUso<IniciarSesionDTO, UsuarioSesion> {
 *   constructor(
 *     private readonly repoUsuarios: RepositorioUsuariosPort,
 *     private readonly hasher: ServicioHashPort
 *   ) {}
 *
 *   public async ejecutar(entrada: IniciarSesionDTO): Promise<Result<UsuarioSesion>> {
 *     // 1. Validar / Invocar entidades de dominio
 *     // 2. Coordinar con puertos
 *     // 3. Retornar Result
 *   }
 * }
 * ```
 */

import { Result } from '../domain/Result';

export interface CasoDeUso<TEntrada, TSalida, TError = string> {
  /**
   * Ejecuta la lógica del caso de uso orquestando entidades y puertos.
   *
   * @param entrada Datos de entrada (DTO plano o primitivos).
   * @returns Una promesa o valor síncrono encapsulado en un `Result` con el resultado o error de negocio.
   */
  ejecutar(entrada: TEntrada): Promise<Result<TSalida, TError>> | Result<TSalida, TError>;
}

/**
 * Alias en inglés para mantener interoperabilidad y claridad conceptual.
 */
export type UseCase<TInput, TOutput, TError = string> = CasoDeUso<TInput, TOutput, TError>;
