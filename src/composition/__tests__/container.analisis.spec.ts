import { ContenedorDependencias } from '../container';

describe('Contenedor: contexto análisis', () => {
  beforeEach(() => ContenedorDependencias.reiniciar());

  it('analiza una cuenta y luego la entrega con ObtenerResultado', async () => {
    const { analizarCuenta, obtenerResultado } = ContenedorDependencias.obtenerInstancia().analisis;

    const sinAnalisis = await obtenerResultado.ejecutar();
    expect(sinAnalisis.esFallo).toBe(true);

    const analizada = await analizarCuenta.ejecutar({ usuario: 'ana' });
    expect(analizada.esExitoso).toBe(true);

    const resultado = await obtenerResultado.ejecutar();
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.handle.valor).toBe('@ana');
    expect(resultado.valor.riesgo.etiqueta).toBe('Riesgo elevado · 78 %');
  });
});