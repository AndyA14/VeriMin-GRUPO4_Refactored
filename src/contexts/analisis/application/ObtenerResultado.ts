import { Result } from '@shared/domain';
import { CasoDeUso } from '@shared/application/CasoDeUso';
import { CuentaCreador } from '../domain/CuentaCreador';
import { RepositorioAnalisisPort } from '../domain/RepositorioAnalisisPort';

export class ObtenerResultado implements CasoDeUso<void, CuentaCreador> {
  constructor(private readonly repositorio: RepositorioAnalisisPort) {}

  public async ejecutar(): Promise<Result<CuentaCreador>> {
    const cuenta = await this.repositorio.obtenerUltimo();
    if (!cuenta) {
      return Result.fail('Todavía no hay un análisis. Busca una cuenta primero.');
    }
    return Result.ok(cuenta);
  }
}