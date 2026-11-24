import { IniciarSesion } from '../IniciarSesion';
import { RepositorioUsuarioEnMemoria } from '../../infrastructure/RepositorioUsuarioEnMemoria';

describe('IniciarSesion (caso de uso)', () => {
  const crearCasoDeUso = () => new IniciarSesion(new RepositorioUsuarioEnMemoria());

  it('inicia sesión y registra al usuario en el primer acceso', async () => {
    const resultado = await crearCasoDeUso().ejecutar({ email: 'Ana.Perez@empresa.com', clave: 'abc123' });
    expect(resultado.esExitoso).toBe(true);
    expect(resultado.valor).toEqual({
      id: 'ana.perez@empresa.com',
      email: 'ana.perez@empresa.com',
      nombre: 'Ana',
    });
  });

  it('reutiliza al usuario ya guardado', async () => {
    const repositorio = new RepositorioUsuarioEnMemoria();
    const caso = new IniciarSesion(repositorio);
    await caso.ejecutar({ email: 'ana@empresa.com', clave: 'abc123' });
    const segundo = await caso.ejecutar({ email: 'ana@empresa.com', clave: 'abc123' });
    expect(segundo.esExitoso).toBe(true);
  });

  it('rechaza un correo inválido', async () => {
    const resultado = await crearCasoDeUso().ejecutar({ email: 'sin-arroba', clave: 'abc123' });
    expect(resultado.esFallo).toBe(true);
    expect(resultado.error).toBe('Ingresa un correo corporativo válido.');
  });

  it('rechaza una contraseña corta', async () => {
    const resultado = await crearCasoDeUso().ejecutar({ email: 'ana@empresa.com', clave: '123' });
    expect(resultado.esFallo).toBe(true);
    expect(resultado.error).toContain('al menos 6 caracteres');
  });
});