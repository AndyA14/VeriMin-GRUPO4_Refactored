/**
 * ============================================================================
 * COMPOSITION ROOT (RAÍZ DE COMPOSICIÓN): CONTENEDOR DE DEPENDENCIAS
 * ============================================================================
 *
 * ¿QUÉ ES EL COMPOSITION ROOT Y POR QUÉ EXISTE EN ARQUITECTURA HEXAGONAL?
 * En la Arquitectura Hexagonal (Puertos y Adaptadores), los módulos de Dominio
 * y Aplicación definen "Puertos" (interfaces abstractas) para expresar sus
 * necesidades sin saber quién o cómo las resolverá.
 *
 * Los módulos de Infraestructura proveen "Adaptadores" (implementaciones concretas:
 * bases de datos, APIs REST, LocalStorage, pasarelas de pago externas).
 *
 * El Composition Root es el único lugar de toda la aplicación donde se ensambla
 * el grafo de objetos y se resuelven las dependencias (Inyección de Dependencias).
 * Se ubica en la frontera exterior del sistema para que las capas internas
 * jamás conozcan detalles de infraestructura ni librerías concretas.
 *
 * BENEFICIOS:
 * 1. Desacoplamiento total: Ni el dominio ni la aplicación conocen Axios, SQLite, etc.
 * 2. Facilidad de testing: Podemos inyectar adaptadores en memoria o mocks en segundos.
 * 3. Flexibilidad: Cambiar de Firebase a una API REST propia solo requiere cambiar
 *    la línea donde se enlaza el adaptador en este archivo, sin tocar una sola
 *    línea de código de negocio.
 *
 * ============================================================================
 * GUÍA DE USO PARA DESARROLLADORES POR CADA BOUNDED CONTEXT:
 * ============================================================================
 *
 * EJEMPLO EDUCATIVO DE CÓMO REGISTRAR UN PUERTO Y ALTERNAR ENTRE ADAPTADORES:
 *
 * 1. Supongamos que en `src/contexts/identity/domain/RepositorioUsuarioPort.ts` defines:
 *    ```typescript
 *    export interface RepositorioUsuarioPort {
 *      buscarPorEmail(email: string): Promise<Result<Usuario | null>>;
 *      guardar(usuario: Usuario): Promise<Result<void>>;
 *    }
 *    ```
 *
 * 2. En `src/contexts/identity/infrastructure/` creas dos adaptadores:
 *    - `RepositorioUsuarioEnMemoria.ts` (para desarrollo local rápido o tests)
 *    - `RepositorioUsuarioHttpApi.ts` (para producción consumiendo el backend)
 *
 * 3. En este archivo (`container.ts`), registras y alternas según el entorno:
 *    ```typescript
 *    const USAR_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';
 *
 *    const repositorioUsuario: RepositorioUsuarioPort = USAR_MOCKS
 *      ? new RepositorioUsuarioEnMemoria()
 *      : new RepositorioUsuarioHttpApi(clienteHttp);
 *    ```
 */

import { IniciarSesion } from '../contexts/identity/application/IniciarSesion';
import type { RepositorioUsuarioPort } from '../contexts/identity/domain';
import { RepositorioUsuarioEnMemoria } from '../contexts/identity/infrastructure/RepositorioUsuarioEnMemoria';

/**
 * Contratos de Puertos para el Bounded Context: Identidad (Identity)
 * Se reemplazarán por las interfaces reales cuando el equipo las cree en su contexto.
 */
export interface ContenedorIdentidad {
  repositorioUsuario: RepositorioUsuarioPort;
  iniciarSesion: IniciarSesion;
}

/**
 * Contratos de Puertos para el Bounded Context: Análisis
 */
export interface ContenedorAnalisis {
  // Ejemplo: repositorioAnalisis: RepositorioAnalisisPort;
  // Ejemplo: servicioMotorIA: ServicioMotorIAPort;
  [clave: string]: unknown;
}

/**
 * Contratos de Puertos para el Bounded Context: Facturación
 */
export interface ContenedorFacturacion {
  // Ejemplo: pasarelaPago: PasarelaPagoPort;
  // Ejemplo: repositorioFacturas: RepositorioFacturasPort;
  [clave: string]: unknown;
}

/**
 * Grafo completo de dependencias de la aplicación organizado por Bounded Contexts.
 */
export interface DependenciasApp {
  identidad: ContenedorIdentidad;
  analisis: ContenedorAnalisis;
  facturacion: ContenedorFacturacion;
}

/**
 * Clase que gestiona la composición e instanciación de dependencias del sistema.
 */
export class ContenedorDependencias {
  private static instancia: ContenedorDependencias | null = null;
  private readonly dependencias: DependenciasApp;

  private constructor() {
    this.dependencias = this.inicializarDependencias();
  }

  /**
   * Obtiene la instancia única (Singleton) del contenedor de dependencias.
   */
  public static obtenerInstancia(): ContenedorDependencias {
    if (!ContenedorDependencias.instancia) {
      ContenedorDependencias.instancia = new ContenedorDependencias();
    }
    return ContenedorDependencias.instancia;
  }

  /**
   * Permite reiniciar el contenedor (útil en pruebas automatizadas).
   */
  public static reiniciar(): void {
    ContenedorDependencias.instancia = null;
  }

  /**
   * Ensambla los adaptadores correspondientes a cada puerto según la configuración activa.
   */
  private inicializarDependencias(): DependenciasApp {
    // Bandera para alternar entre adaptadores Mock / En Memoria y adaptadores de Producción
    const usarMocks = false;

    // ------------------------------------------------------------------------
    // BOUNDED CONTEXT: IDENTIDAD
    // ------------------------------------------------------------------------
    const repositorioUsuario: RepositorioUsuarioPort = new RepositorioUsuarioEnMemoria();
    const identidad: ContenedorIdentidad = {
      repositorioUsuario,
      iniciarSesion: new IniciarSesion(repositorioUsuario),
    };

    // ------------------------------------------------------------------------
    // BOUNDED CONTEXT: ANÁLISIS
    // ------------------------------------------------------------------------
    const analisis: ContenedorAnalisis = {
      // repositorioAnalisis: usarMocks ? new RepositorioAnalisisEnMemoria() : new RepositorioAnalisisApi(),
    };

    // ------------------------------------------------------------------------
    // BOUNDED CONTEXT: FACTURACIÓN
    // ------------------------------------------------------------------------
    const facturacion: ContenedorFacturacion = {
      // pasarelaPago: usarMocks ? new PasarelaPagoSimulada() : new PasarelaPagoStripe(),
    };

    // Registro condicional de ejemplo pedagógico para el equipo
    if (usarMocks) {
      // Punto de extensión: inyectar adaptadores in-memory para tests E2E locales
    }

    return {
      identidad,
      analisis,
      facturacion,
    };
  }

  /**
   * Acceso a las dependencias inyectadas del sistema.
   */
  public obtener(): DependenciasApp {
    return this.dependencias;
  }

  /**
   * Atajo para obtener las dependencias del contexto de Identidad.
   */
  public get identidad(): ContenedorIdentidad {
    return this.dependencias.identidad;
  }

  /**
   * Atajo para obtener las dependencias del contexto de Análisis.
   */
  public get analisis(): ContenedorAnalisis {
    return this.dependencias.analisis;
  }

  /**
   * Atajo para obtener las dependencias del contexto de Facturación.
   */
  public get facturacion(): ContenedorFacturacion {
    return this.dependencias.facturacion;
  }
}

/**
 * Instancia predeterminada exportada para uso general en la capa de presentación / enrutador.
 */
export const contenedor = ContenedorDependencias.obtenerInstancia();