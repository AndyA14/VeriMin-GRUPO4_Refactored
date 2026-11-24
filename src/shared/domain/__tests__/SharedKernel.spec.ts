/**
 * ============================================================================
 * PRUEBAS UNITARIAS DE DOMINIO: SHARED KERNEL
 * ============================================================================
 *
 * Este archivo valida los contratos fundamentales del Shared Kernel de Dominio:
 * 1. Igualdad por Identidad en Entity (Entidad).
 * 2. Inmutabilidad e Igualdad Estructural en ValueObject (Objeto de Valor).
 * 3. Flujos de Éxito (ok) y Fallo (fail) en Result (Resultado).
 * 4. Registro inmutable de DomainEvent (Evento de Dominio).
 *
 * Sirve como especificación viva (Living Documentation) para que los desarrolladores
 * comprendan el comportamiento esperado al construir sus Bounded Contexts.
 */

import { Entity, ValueObject, Result, DomainEventBase } from '@shared/domain';

// ============================================================================
// STUBS / CLASES DE PRUEBA PARA LAS ASÉRCIONES
// ============================================================================

interface UsuarioProps {
  nombre: string;
  correo: string;
}

class UsuarioStub extends Entity<UsuarioProps> {
  public constructor(id: string, props: UsuarioProps) {
    super(id, props);
  }

  public cambiarNombre(nuevoNombre: string): void {
    this.props.nombre = nuevoNombre;
  }
}

interface DineroProps {
  monto: number;
  moneda: string;
}

class DineroStub extends ValueObject<DineroProps> {
  public constructor(props: DineroProps) {
    super(props);
  }
}

class UsuarioCreadoEventoStub extends DomainEventBase {
  public constructor(aggregateId: string) {
    super(aggregateId, 'UsuarioCreado');
  }
}

// ============================================================================
// SUITE DE PRUEBAS
// ============================================================================

describe('Shared Kernel - Dominio', () => {
  // --------------------------------------------------------------------------
  // 1. ENTITY (Igualdad por Identidad)
  // --------------------------------------------------------------------------
  describe('Entity (Entidad)', () => {
    it('debe considerar iguales a dos instancias con el mismo ID, aunque sus atributos difieran', () => {
      const usuario1 = new UsuarioStub('usr-100', {
        nombre: 'Carlos',
        correo: 'carlos@ejemplo.com',
      });
      const usuario2 = new UsuarioStub('usr-100', {
        nombre: 'Carlos Modificado',
        correo: 'carlos.nuevo@ejemplo.com',
      });

      // En DDD, dos entidades con el mismo ID representan el mismo concepto de negocio
      expect(usuario1.equals(usuario2)).toBe(true);
      expect(usuario1.esIgual(usuario2)).toBe(true);
    });

    it('debe considerar diferentes a dos instancias con diferente ID, aunque sus atributos sean idénticos', () => {
      const usuario1 = new UsuarioStub('usr-101', {
        nombre: 'María',
        correo: 'maria@ejemplo.com',
      });
      const usuario2 = new UsuarioStub('usr-102', {
        nombre: 'María',
        correo: 'maria@ejemplo.com',
      });

      expect(usuario1.equals(usuario2)).toBe(false);
      expect(usuario1.esIgual(usuario2)).toBe(false);
    });

    it('debe retornar false al comparar con null, undefined o instancias que no son Entity', () => {
      const usuario = new UsuarioStub('usr-103', {
        nombre: 'Ana',
        correo: 'ana@ejemplo.com',
      });

      expect(usuario.equals(null)).toBe(false);
      expect(usuario.equals(undefined)).toBe(false);
      expect(usuario.equals({ id: 'usr-103' } as any)).toBe(false);
    });

    it('debe rechazar la instanciación de una entidad con ID vacío o inválido', () => {
      expect(() => new UsuarioStub('', { nombre: 'Test', correo: 'test@ejemplo.com' })).toThrow();
      expect(() => new UsuarioStub('   ', { nombre: 'Test', correo: 'test@ejemplo.com' })).toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // 2. VALUE OBJECT (Inmutabilidad e Igualdad Estructural)
  // --------------------------------------------------------------------------
  describe('ValueObject (Objeto de Valor)', () => {
    it('debe considerar iguales a dos instancias con las mismas propiedades estructurales', () => {
      const dinero1 = new DineroStub({ monto: 1500, moneda: 'USD' });
      const dinero2 = new DineroStub({ monto: 1500, moneda: 'USD' });

      // En DDD, la igualdad es por valor y no por referencia
      expect(dinero1.equals(dinero2)).toBe(true);
      expect(dinero1.esIgual(dinero2)).toBe(true);
    });

    it('debe considerar distintas a dos instancias con propiedades diferentes', () => {
      const dinero1 = new DineroStub({ monto: 1500, moneda: 'USD' });
      const dinero2 = new DineroStub({ monto: 2000, moneda: 'USD' });
      const dinero3 = new DineroStub({ monto: 1500, moneda: 'EUR' });

      expect(dinero1.equals(dinero2)).toBe(false);
      expect(dinero1.equals(dinero3)).toBe(false);
    });

    it('debe garantizar inmutabilidad estricta (Object.freeze) impidiendo mutaciones en runtime', () => {
      const dinero = new DineroStub({ monto: 500, moneda: 'PEN' });

      // Verificar que el objeto y sus props están congelados
      expect(Object.isFrozen(dinero)).toBe(true);
      expect(Object.isFrozen(dinero.props)).toBe(true);

      // Intentar mutar una propiedad congelada debe lanzar excepción en strict mode
      expect(() => {
        (dinero.props as any).monto = 9999;
      }).toThrow();

      expect(dinero.props.monto).toBe(500);
    });

    it('debe retornar false al comparar con null, undefined o instancias que no son ValueObject', () => {
      const dinero = new DineroStub({ monto: 100, moneda: 'USD' });

      expect(dinero.equals(null)).toBe(false);
      expect(dinero.equals(undefined)).toBe(false);
      expect(dinero.equals({ monto: 100, moneda: 'USD' } as any)).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 3. RESULT (Flujos OK y FAIL)
  // --------------------------------------------------------------------------
  describe('Result (Patrón Resultado)', () => {
    it('debe manejar adecuadamente un resultado exitoso (Result.ok)', () => {
      const datosPrueba = { balance: 4500 };
      const resultado = Result.ok(datosPrueba);

      expect(resultado.isSuccess).toBe(true);
      expect(resultado.isFailure).toBe(false);
      expect(resultado.esExitoso).toBe(true);
      expect(resultado.esFallo).toBe(false);
      expect(resultado.getValue()).toEqual(datosPrueba);
      expect(resultado.valor).toEqual(datosPrueba);

      // No se puede acceder al error en un resultado exitoso
      expect(() => resultado.getError()).toThrow();
      expect(() => resultado.error).toThrow();
    });

    it('debe manejar adecuadamente un resultado fallido (Result.fail)', () => {
      const mensajeError = 'Fondos insuficientes para la transacción.';
      const resultado = Result.fail<number, string>(mensajeError);

      expect(resultado.isSuccess).toBe(false);
      expect(resultado.isFailure).toBe(true);
      expect(resultado.esExitoso).toBe(false);
      expect(resultado.esFallo).toBe(true);
      expect(resultado.getError()).toBe(mensajeError);
      expect(resultado.error).toBe(mensajeError);

      // No se puede acceder al valor en un resultado fallido
      expect(() => resultado.getValue()).toThrow();
      expect(() => resultado.valor).toThrow();
    });

    it('debe validar la combinación de múltiples resultados con Result.combine', () => {
      const ok1 = Result.ok('Dato 1');
      const ok2 = Result.ok('Dato 2');
      const combinacionExitosa = Result.combine([ok1, ok2]);

      expect(combinacionExitosa.isSuccess).toBe(true);

      const fail1 = Result.fail('Error en campo 1');
      const fail2 = Result.fail('Error en campo 2');
      const combinacionFallida = Result.combine([ok1, fail1, fail2]);

      expect(combinacionFallida.isFailure).toBe(true);
      expect(combinacionFallida.getError()).toBe('Error en campo 1');
    });
  });

  // --------------------------------------------------------------------------
  // 4. DOMAIN EVENT (Evento de Dominio)
  // --------------------------------------------------------------------------
  describe('DomainEvent (Evento de Dominio)', () => {
    it('debe instanciar un evento de dominio con aggregateId y occurredOn inmutables', () => {
      const fechaAntes = new Date();
      const evento = new UsuarioCreadoEventoStub('usr-agregado-99');
      const fechaDespues = new Date();

      expect(evento.aggregateId).toBe('usr-agregado-99');
      expect(evento.eventName).toBe('UsuarioCreado');
      expect(evento.occurredOn.getTime()).toBeGreaterThanOrEqual(fechaAntes.getTime());
      expect(evento.occurredOn.getTime()).toBeLessThanOrEqual(fechaDespues.getTime());
      expect(Object.isFrozen(evento)).toBe(true);
    });
  });
});
