import { Contrasena } from '../Contrasena';

describe('Contrasena (Value Object)', () => {
  it('acepta una contraseña de 6 o más caracteres', () => {
    const resultado = Contrasena.crear('abc123');
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.valor).toBe('abc123');
  });

  it.each(['', '12345'])('rechaza "%s" por ser muy corta', (corta) => {
    const resultado = Contrasena.crear(corta);
    expect(resultado.esFallo).toBe(true);
    expect(resultado.error).toContain('al menos 6 caracteres');
  });

  it('es inmutable', () => {
    const contrasena = Contrasena.crear('abc123').valor;
    expect(Object.isFrozen(contrasena)).toBe(true);
  });
});