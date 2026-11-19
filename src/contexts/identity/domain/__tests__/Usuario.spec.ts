import { Email } from '../Email';
import { Usuario } from '../Usuario';

describe('Usuario (Entidad)', () => {
  const crear = (correo: string) => Usuario.registrar(Email.crear(correo).valor).valor;

  it('deriva el nombre del correo', () => {
    expect(crear('ana.perez@empresa.com').nombre).toBe('Ana');
    expect(crear('CARLOS99@empresa.com').nombre).toBe('Carlos');
  });

  it('usa un nombre por defecto si el correo no aporta uno', () => {
    expect(crear('123@empresa.com').nombre).toBe('Usuario');
  });

  it('dos usuarios con el mismo correo son la misma entidad', () => {
    expect(crear('a@b.com').esIgual(crear('A@B.com'))).toBe(true);
  });
});