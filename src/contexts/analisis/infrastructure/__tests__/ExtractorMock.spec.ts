import { ExtractorMock } from '../ExtractorMock';
import { Handle } from '../../domain/Handle';

describe('ExtractorMock (adaptador)', () => {
  it('devuelve los datos de ejemplo que hoy muestra el prototipo', async () => {
    const cuenta = await new ExtractorMock().extraer(Handle.crear('carlospati').valor);

    expect(cuenta.handle.valor).toBe('@carlospati');
    expect(cuenta.seguidores).toBe('24.8K');
    expect(cuenta.publicaciones).toBe(10);
    expect(cuenta.benford.chi2).toBe(24.51);
    expect(cuenta.benford.critico).toBe(20.09);
    expect(cuenta.comentariosHostiles).toEqual({ cantidad: 3, total: 10 });
    expect(cuenta.riesgo.etiqueta).toBe('Riesgo elevado · 78 %');
  });

  it('usa el @usuario que se le pide', async () => {
    const cuenta = await new ExtractorMock().extraer(Handle.crear('maria').valor);
    expect(cuenta.handle.valor).toBe('@maria');
  });
});