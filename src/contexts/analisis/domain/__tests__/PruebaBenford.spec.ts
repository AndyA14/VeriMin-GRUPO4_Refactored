import { PruebaBenford } from '../PruebaBenford';

describe('PruebaBenford (Ley de Benford)', () => {
  it('marca anomalía cuando χ² supera el valor crítico (24,51 > 20,09)', () => {
    const prueba = PruebaBenford.crear(24.51, 20.09).valor;
    expect(prueba.esAnomala).toBe(true);
  });

  it('no marca anomalía cuando χ² es menor o igual al crítico', () => {
    expect(PruebaBenford.crear(10).valor.esAnomala).toBe(false);
    expect(PruebaBenford.crear(20.09, 20.09).valor.esAnomala).toBe(false);
  });

  it('usa 20,09 como valor crítico por defecto', () => {
    expect(PruebaBenford.crear(5).valor.critico).toBe(20.09);
  });

  it('rechaza valores negativos, no numéricos o un crítico en cero', () => {
    expect(PruebaBenford.crear(-1).esFallo).toBe(true);
    expect(PruebaBenford.crear(NaN).esFallo).toBe(true);
    expect(PruebaBenford.crear(5, 0).esFallo).toBe(true);
  });
});