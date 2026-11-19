import { RepositorioAnalisisEnMemoria } from '../RepositorioAnalisisEnMemoria';
import { ExtractorMock } from '../ExtractorMock';
import { Handle } from '../../domain/Handle';

describe('RepositorioAnalisisEnMemoria (adaptador)', () => {
  it('no tiene ningún análisis al empezar', async () => {
    const repo = new RepositorioAnalisisEnMemoria();
    expect(await repo.obtenerUltimo()).toBeNull();
  });

  it('devuelve el último análisis guardado', async () => {
    const repo = new RepositorioAnalisisEnMemoria();
    const primera = await new ExtractorMock().extraer(Handle.crear('ana').valor);
    const segunda = await new ExtractorMock().extraer(Handle.crear('luis').valor);

    await repo.guardar(primera);
    await repo.guardar(segunda);

    const guardada = await repo.obtenerUltimo();
    expect(guardada?.handle.valor).toBe('@luis');
  });
});