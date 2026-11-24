import { Entity, Result } from '@shared/domain';
import { Handle } from './Handle';
import { NivelRiesgo } from './NivelRiesgo';
import { PruebaBenford } from './PruebaBenford';

export interface ComentariosHostiles {
  cantidad: number;
  total: number;
}

interface CuentaCreadorPropiedades {
  handle: Handle;
  seguidores: string;
  publicaciones: number;
  benford: PruebaBenford;
  comentariosHostiles: ComentariosHostiles;
  riesgo: NivelRiesgo;
}

export interface DatosCuentaCreador {
  id: string;
  handle: Handle;
  seguidores: string;
  publicaciones: number;
  benford: PruebaBenford;
  comentariosHostiles: ComentariosHostiles;
  riesgo: NivelRiesgo;
}

/**
 * Agregado raíz del contexto `analisis`: una cuenta de creador analizada.
 * Protege la regla de que los comentarios hostiles nunca superan el total.
 */
export class CuentaCreador extends Entity<CuentaCreadorPropiedades> {
  private constructor(id: string, propiedades: CuentaCreadorPropiedades) {
    super(id, propiedades);
  }

  public static crear(datos: DatosCuentaCreador): Result<CuentaCreador> {
    if (!datos.id || datos.id.trim().length === 0) {
      return Result.fail('La cuenta necesita un identificador.');
    }
    if (!Number.isInteger(datos.publicaciones) || datos.publicaciones < 0) {
      return Result.fail('Las publicaciones deben ser un entero mayor o igual a 0.');
    }
    const { cantidad, total } = datos.comentariosHostiles;
    if (!Number.isInteger(cantidad) || !Number.isInteger(total) || cantidad < 0 || total < 0) {
      return Result.fail('Los comentarios deben ser enteros mayores o iguales a 0.');
    }
    if (cantidad > total) {
      return Result.fail('Los comentarios hostiles no pueden superar el total analizado.');
    }
    return Result.ok(
      new CuentaCreador(datos.id, {
        handle: datos.handle,
        seguidores: datos.seguidores,
        publicaciones: datos.publicaciones,
        benford: datos.benford,
        comentariosHostiles: { cantidad, total },
        riesgo: datos.riesgo,
      }),
    );
  }

  public get handle(): Handle {
    return this.propiedades.handle;
  }
  public get seguidores(): string {
    return this.propiedades.seguidores;
  }
  public get publicaciones(): number {
    return this.propiedades.publicaciones;
  }
  public get benford(): PruebaBenford {
    return this.propiedades.benford;
  }
  public get comentariosHostiles(): ComentariosHostiles {
    return this.propiedades.comentariosHostiles;
  }
  public get riesgo(): NivelRiesgo {
    return this.propiedades.riesgo;
  }

  /** Hay señales de alerta si Benford es anómalo o el riesgo no es bajo. */
  public get requiereAtencion(): boolean {
    return this.propiedades.benford.esAnomala || this.propiedades.riesgo.categoria !== 'bajo';
  }
}