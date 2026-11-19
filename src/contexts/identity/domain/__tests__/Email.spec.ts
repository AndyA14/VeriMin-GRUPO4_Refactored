import { Email } from '../Email';

describe('Email (Value Object)', () => {
  it('acepta un correo válido y lo normaliza', () => {
    const resultado = Email.crear('  Ana.Perez@Empresa.COM ');
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.valor).toBe('ana.perez@empresa.com');
  });

  it.each(['', 'sin-arroba', 'a@b', 'a b@c.com', 'a@b.c'])('rechaza "%s"', (invalido) => {
    const resultado = Email.crear(invalido);
    expect(resultado.esFallo).toBe(true);
    expect(resultado.error).toBe('Ingresa un correo corporativo válido.');
  });

  it('dos correos con la misma dirección son iguales', () => {
    const a = Email.crear('a@b.com').valor;
    const b = Email.crear('A@B.com').valor;
    expect(a.esIgual(b)).toBe(true);
  });
});