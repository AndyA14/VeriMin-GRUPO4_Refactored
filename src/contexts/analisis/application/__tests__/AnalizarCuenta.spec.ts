import { AnalizarCuenta } from '../AnalizarCuenta';
import { CuentaCreador } from '../../domain/CuentaCreador';
import { ExtractorCuentasPort } from '../../domain/ExtractorCuentasPort';
import { Handle } from '../../domain/Handle';
import { NivelRiesgo } from '../../domain/NivelRiesgo';
import { PruebaBenford } from '../../domain/PruebaBenford';
import { RepositorioAnalisisPort } from '../../domain/RepositorioAnalisisPort';

class ExtractorFalso implements ExtractorCuentasPort {
  public handlesPedidos: string[] = [];

  constructor(private readonly falla = false) {}

  async extraer(handle: Handle): Promise<CuentaCreador> {
    if (this.falla) throw new Error('sin conexión');
    this.handlesPedidos.push(handle.valor);
    return CuentaCreador.crear({
      id: handle.valor,
      handle,
      seguidores: '24.8K',
      publicaciones: 10,
      benford: PruebaBenford.crear(24.51).valor,
      comentariosHostiles: { cantidad: 3, total: 10 },
      riesgo: NivelRiesgo.crear(78).valor,
    }).valor;
  }
}

class RepositorioFalso implements RepositorioAnalisisPort {
  public guardada: CuentaCreador | null = null;
  async guardar(cuenta: CuentaCreador): Promise<void> {
    this.guardada = cuenta;
  }
  async obtenerUltimo(): Promise<CuentaCreador | null> {
    return this.guardada;
  }
}

describe('AnalizarCuenta (caso de uso)', () => {
  it('analiza el usuario escrito, lo guarda y devuelve la cuenta', async () => {
    const extractor = new ExtractorFalso();
    const repo = new RepositorioFalso();
    const resultado = await new AnalizarCuenta(extractor, repo).ejecutar({ usuario: 'maria' });

    expect(resultado.esExitoso).toBe(true);
    expect(extractor.handlesPedidos).toEqual(['@maria']);
    expect(repo.guardada?.handle.valor).toBe('@maria');
  });

  it('usa @carlospati cuando el campo está vacío', async () => {
    const extractor = new ExtractorFalso();
    const repo = new RepositorioFalso();
    const resultado = await new AnalizarCuenta(extractor, repo).ejecutar({ usuario: '   ' });

    expect(resultado.esExitoso).toBe(true);
    expect(extractor.handlesPedidos).toEqual(['@carlospati']);
  });

  it('falla con un mensaje claro cuando el extractor lanza un error y no guarda nada', async () => {
    const repo = new RepositorioFalso();
    const resultado = await new AnalizarCuenta(new ExtractorFalso(true), repo).ejecutar({
      usuario: 'maria',
    });

    expect(resultado.esFallo).toBe(true);
    expect(repo.guardada).toBeNull();
  });
});