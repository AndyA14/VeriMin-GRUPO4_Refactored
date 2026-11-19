import { CuentaCreador } from './CuentaCreador';
import { Handle } from './Handle';

/**
 * Puerto de salida: de dónde salen los datos de una cuenta.
 * Hoy lo cumple un mock; mañana puede cumplirlo un scraper real de TikTok.
 */
export interface ExtractorCuentasPort {
  extraer(handle: Handle): Promise<CuentaCreador>;
}