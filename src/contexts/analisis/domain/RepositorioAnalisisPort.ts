import { CuentaCreador } from './CuentaCreador';

/**
 * Puerto de salida: dónde se guarda el último análisis para que
 * resultado, informe y chat lo lean.
 */
export interface RepositorioAnalisisPort {
  guardar(cuenta: CuentaCreador): Promise<void>;
  obtenerUltimo(): Promise<CuentaCreador | null>;
}