import { ObtenerResultado } from '../ObtenerResultado';
import { CuentaCreador } from '../../domain/CuentaCreador';
import { Handle } from '../../domain/Handle';
import { NivelRiesgo } from '../../domain/NivelRiesgo';
import { PruebaBenford } from '../../domain/PruebaBenford';
import { RepositorioAnalisisPort } from '../../domain/RepositorioAnalisisPort';

class RepositorioFalso implements RepositorioAnalisisPort {
  constructor(private cuenta: CuentaCreador | null = null) {}
  async guardar(cuenta: CuentaCreador): Promise<void> {
    this.cuenta = cuenta;
  }
  async obtenerUltimo(): Promise<CuentaCreador | null> {
    return this.cuenta;
  }
}

const cuentaDeEjemplo = (): CuentaCreador =>
  CuentaCreador.crear({
    id: '@carlospati',
    handle: Handle.crear('carlospati').valor,
    seguidores: '24.8K',
    publicaciones: 10,
    benford: PruebaBenford.crear(24.51).valor,
    comentariosHostiles: { cantidad: 3, total: 10 },
    riesgo: NivelRiesgo.crear(78).valor,
  }).valor;

describe('ObtenerResultado (caso de uso)', () => {
  it('devuelve el último análisis guardado', async () => {
    const cuenta = cuentaDeEjemplo();
    const resultado = await new ObtenerResultado(new RepositorioFalso(cuenta)).ejecutar();

    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.handle.valor).toBe('@carlospati');
    expect(resultado.valor.riesgo.etiqueta).toBe('Riesgo elevado · 78 %');
  });

  it('falla con un mensaje claro cuando todavía no hay ningún análisis', async () => {
    const resultado = await new ObtenerResultado(new RepositorioFalso()).ejecutar();

    expect(resultado.esFallo).toBe(true);
    expect(resultado.error).toBe('Todavía no hay un análisis. Busca una cuenta primero.');
  });
});