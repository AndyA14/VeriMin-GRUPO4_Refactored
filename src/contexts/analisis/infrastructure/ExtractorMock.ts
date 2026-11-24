import { CuentaCreador } from '../domain/CuentaCreador';
import { ExtractorCuentasPort } from '../domain/ExtractorCuentasPort';
import { Handle } from '../domain/Handle';
import { NivelRiesgo } from '../domain/NivelRiesgo';
import { PruebaBenford } from '../domain/PruebaBenford';

/**
 * Adaptador de prueba: devuelve los mismos datos de ejemplo que hoy muestra
 * el prototipo. Mañana se puede cambiar por un extractor real de TikTok sin
 * tocar el dominio ni los casos de uso.
 */
export class ExtractorMock implements ExtractorCuentasPort {
  public async extraer(handle: Handle): Promise<CuentaCreador> {
    return CuentaCreador.crear({
      id: handle.valor,
      handle,
      seguidores: '24.8K',
      publicaciones: 10,
      benford: PruebaBenford.crear(24.51, 20.09).valor,
      comentariosHostiles: { cantidad: 3, total: 10 },
      riesgo: NivelRiesgo.crear(78).valor,
    }).valor;
  }
}