import { NivelRiesgo } from '../NivelRiesgo';

describe('NivelRiesgo', () => {
  it('genera la misma etiqueta que muestra hoy la app para 78 %', () => {
    const riesgo = NivelRiesgo.crear(78).valor;
    expect(riesgo.categoria).toBe('elevado');
    expect(riesgo.etiqueta).toBe('Riesgo elevado · 78 %');
  });

  it('clasifica en bajo, medio y elevado según los umbrales', () => {
    expect(NivelRiesgo.crear(20).valor.categoria).toBe('bajo');
    expect(NivelRiesgo.crear(35).valor.categoria).toBe('medio');
    expect(NivelRiesgo.crear(64).valor.categoria).toBe('medio');
    expect(NivelRiesgo.crear(65).valor.categoria).toBe('elevado');
  });

  it('redondea el porcentaje al entero más cercano', () => {
    expect(NivelRiesgo.crear(77.6).valor.porcentaje).toBe(78);
  });

  it('rechaza porcentajes fuera de 0 a 100 o no numéricos', () => {
    expect(NivelRiesgo.crear(-1).esFallo).toBe(true);
    expect(NivelRiesgo.crear(101).esFallo).toBe(true);
    expect(NivelRiesgo.crear(NaN).esFallo).toBe(true);
  });
});