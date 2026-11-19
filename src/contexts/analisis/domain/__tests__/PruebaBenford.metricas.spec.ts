import { PruebaBenford } from '../PruebaBenford';

/** Genera valores cuyo primer dígito sigue casi exactamente la Ley de Benford (n = 1000). */
function muestraConforme(): number[] {
  const conteos = [301, 176, 125, 97, 79, 67, 58, 51, 46];
  return conteos.flatMap((cantidad, i) => Array.from({ length: cantidad }, () => (i + 1) * 100));
}

describe('PruebaBenford.desdeMetricas', () => {
  it('no marca anomalía cuando los datos siguen Benford', () => {
    const resultado = PruebaBenford.desdeMetricas(muestraConforme());
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.chi2).toBeLessThan(1);
    expect(resultado.valor.esAnomala).toBe(false);
  });

  it('marca anomalía cuando todos los valores empiezan con el mismo dígito', () => {
    const resultado = PruebaBenford.desdeMetricas(Array.from({ length: 60 }, () => 500));
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.esAnomala).toBe(true);
  });

  it('ignora valores inválidos (NaN, negativos, ceros y menores que 1)', () => {
    const conRuido = [...muestraConforme(), Number.NaN, -3, 0, 0.5, Infinity];
    const a = PruebaBenford.desdeMetricas(conRuido);
    const b = PruebaBenford.desdeMetricas(muestraConforme());
    expect(a.valor.chi2).toBeCloseTo(b.valor.chi2, 10);
  });

  it('falla si hay menos métricas válidas que la muestra mínima', () => {
    const resultado = PruebaBenford.desdeMetricas([100, 200, 300]);
    expect(resultado.esFallo).toBe(true);
  });

  it('respeta un valor crítico personalizado', () => {
    const resultado = PruebaBenford.desdeMetricas(Array.from({ length: 60 }, () => 500), 1e9);
    expect(resultado.valor.esAnomala).toBe(false);
  });
});