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

/** Usuario de ejemplo que la app usa cuando el campo se deja vacío. */
export const HANDLE_POR_DEFECTO = '@carlospati';

export class AnalizarCuenta implements CasoDeUso<AnalizarCuentaEntrada, CuentaCreador> {
  constructor(
    private readonly extractor: ExtractorCuentasPort,
    private readonly repositorio: RepositorioAnalisisPort,
  ) {}

  public async ejecutar(entrada: AnalizarCuentaEntrada): Promise<Result<CuentaCreador>> {
    const texto = entrada.usuario?.trim() ? entrada.usuario : HANDLE_POR_DEFECTO;

    const handle = Handle.crear(texto);
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