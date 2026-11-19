import { Result } from '@shared/domain';
import { CasoDeUso } from '@shared/application/CasoDeUso';
import { CuentaCreador } from '../domain/CuentaCreador';
import { ExtractorCuentasPort } from '../domain/ExtractorCuentasPort';
import { Handle } from '../domain/Handle';
import { RepositorioAnalisisPort } from '../domain/RepositorioAnalisisPort';

export interface AnalizarCuentaEntrada {
  /** Texto tal como lo escribió el usuario, con o sin @. */
  usuario: string;
}

export class AnalizarCuenta implements CasoDeUso<AnalizarCuentaEntrada, CuentaCreador> {
  constructor(
    private readonly extractor: ExtractorCuentasPort,
    private readonly repositorio: RepositorioAnalisisPort,
  ) {}

  public async ejecutar(entrada: AnalizarCuentaEntrada): Promise<Result<CuentaCreador>> {
    const handle = Handle.crear(entrada.usuario);
    if (handle.esFallo) {
      return Result.fail(handle.error);
    }

    try {
      const cuenta = await this.extractor.extraer(handle.valor);
      await this.repositorio.guardar(cuenta);
      return Result.ok(cuenta);
    } catch {
      return Result.fail('No se pudo analizar la cuenta. Intenta de nuevo.');
    }
  }
}