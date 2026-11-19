/**
 * ============================================================================
 * CONFIGURACIÓN DE JEST PARA TESTS DE DOMINIO (SHARED KERNEL Y CONTEXTOS DDD)
 * ============================================================================
 *
 * Configuración de entorno Node puro (sin emuladores, ni React Native, ni JSDOM),
 * optimizada para ejecutar pruebas unitarias de Dominio y Aplicación en milisegundos.
 * Resuelve los alias de TypeScript `@shared/*`, `@contexts/*` y `@composition/*`.
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@composition/(.*)$': '<rootDir>/src/composition/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/__tests__/**/*.test.ts',
  ],
  verbose: true,
};
