import { Handle } from '../Handle';

describe('Handle (@usuario de TikTok)', () => {
  it('agrega el @ cuando el usuario no lo trae', () => {
    const resultado = Handle.crear('carlospati');
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor.valor).toBe('@carlospati');
  });

  it('quita arrobas repetidos y espacios', () => {
    const resultado = Handle.crear('  @@carlos pati  ');
    expect(resultado.valor.valor).toBe('@carlospati');
  });

  it('rechaza un texto vacío o que solo tiene arrobas y espacios', () => {
    expect(Handle.crear('').esFallo).toBe(true);
    expect(Handle.crear('   ').esFallo).toBe(true);
    expect(Handle.crear('@@ ').esFallo).toBe(true);
  });

  it('considera iguales a dos handles con el mismo valor', () => {
    const a = Handle.crear('@carlospati').valor;
    const b = Handle.crear('carlospati').valor;
    expect(a.equals(b)).toBe(true);
  });
});