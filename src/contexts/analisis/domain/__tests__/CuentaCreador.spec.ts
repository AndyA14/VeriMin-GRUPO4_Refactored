import { CuentaCreador, DatosCuentaCreador } from '../CuentaCreador';
import { Handle } from '../Handle';
import { NivelRiesgo } from '../NivelRiesgo';
import { PruebaBenford } from '../PruebaBenford';

const datosBase = (): DatosCuentaCreador => ({
  id: 'cuenta-1',
  handle: Handle.crear('carlospati').valor,
  seguidores: '24.8K',
  publicaciones: 10,
  benford: PruebaBenford.crear(24.51).valor,
  comentariosHostiles: { cantidad: 3, total: 10 },
  riesgo: NivelRiesgo.crear(78).valor,
});

describe('CuentaCreador (agregado)', () => {
  it('crea la cuenta con los mismos datos que hoy muestra la app', () => {
    const cuenta = CuentaCreador.crear(datosBase()).valor;
    expect(cuenta.handle.valor).toBe('@carlospati');
    expect(cuenta.seguidores).toBe('24.8K');
    expect(cuenta.publicaciones).toBe(10);
    expect(cuenta.benford.esAnomala).toBe(true);
    expect(cuenta.riesgo.etiqueta).toBe('Riesgo elevado · 78 %');
    expect(cuenta.comentariosHostiles).toEqual({ cantidad: 3, total: 10 });
  });

  it('rechaza comentarios hostiles mayores que el total', () => {
    const resultado = CuentaCreador.crear({
      ...datosBase(),
      comentariosHostiles: { cantidad: 11, total: 10 },
    });
    expect(resultado.esFallo).toBe(true);
  });

  it('rechaza publicaciones negativas o no enteras', () => {
    expect(CuentaCreador.crear({ ...datosBase(), publicaciones: -1 }).esFallo).toBe(true);
    expect(CuentaCreador.crear({ ...datosBase(), publicaciones: 1.5 }).esFallo).toBe(true);
  });

  it('rechaza un id vacío', () => {
    expect(CuentaCreador.crear({ ...datosBase(), id: '  ' }).esFallo).toBe(true);
  });

  it('dos cuentas con el mismo id son iguales aunque cambien sus datos', () => {
    const a = CuentaCreador.crear(datosBase()).valor;
    const b = CuentaCreador.crear({ ...datosBase(), seguidores: '1K' }).valor;
    expect(a.equals(b)).toBe(true);
  });

  it('indica que requiere atención cuando hay anomalía o riesgo no bajo', () => {
    const alerta = CuentaCreador.crear(datosBase()).valor;
    const tranquila = CuentaCreador.crear({
      ...datosBase(),
      id: 'cuenta-2',
      benford: PruebaBenford.crear(5).valor,
      riesgo: NivelRiesgo.crear(10).valor,
    }).valor;
    expect(alerta.requiereAtencion).toBe(true);
    expect(tranquila.requiereAtencion).toBe(false);
  });
});