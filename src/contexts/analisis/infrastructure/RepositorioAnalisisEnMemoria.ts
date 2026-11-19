import { CuentaCreador } from '../domain/CuentaCreador';
import { RepositorioAnalisisPort } from '../domain/RepositorioAnalisisPort';

/**
 * Adaptador en memoria: conserva solo el último análisis mientras la app
 * está abierta. Más adelante se puede cambiar por almacenamiento local
 * o una API sin tocar el dominio.
 */
export class RepositorioAnalisisEnMemoria implements RepositorioAnalisisPort {
  private ultima: CuentaCreador | null = null;

  public async guardar(cuenta: CuentaCreador): Promise<void> {
    this.ultima = cuenta;
  }

  public async obtenerUltimo(): Promise<CuentaCreador | null> {
    return this.ultima;
  }
}