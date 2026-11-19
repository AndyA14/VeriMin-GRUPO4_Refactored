// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*'],
  },
  {
    // ========================================================================
    // REGLA DE DEPENDENCIA EN ARQUITECTURA HEXAGONAL Y DOMAIN-DRIVEN DESIGN
    // ========================================================================
    //
    // La regla de oro de la Arquitectura Hexagonal (Puertos y Adaptadores) y DDD
    // establece que:
    // "EL DOMINIO NO CONOCE EL EXTERIOR Y LAS DEPENDENCIAS SIEMPRE APUNTAN
    //  HACIA ADENTRO".
    //
    // 1. Agnóstico a Frameworks y UI:
    //    El Dominio (src/shared/domain y src/contexts/*/domain) debe ser
    //    TypeScript puro. Jamás debe importar React, React Native, componentes
    //    visuales o utilidades de Expo.
    //
    // 2. Aislamiento de Capas Superiores y Contextos:
    //    El Dominio define entidades, objetos de valor y puertos (interfaces),
    //    pero nunca debe importar implementaciones de application, infrastructure,
    //    ni la raíz de composition. Tampoco debe acoplarse directamente a otros
    //    Bounded Contexts (@contexts/*).
    //
    // Cualquier violación a estas restricciones rompe la pureza del modelo de negocio
    // y genera acoplamiento indeseado.
    files: [
      'src/contexts/*/domain/**/*.{js,jsx,ts,tsx}',
      'src/contexts/**/domain/**/*.{js,jsx,ts,tsx}',
      'src/shared/domain/**/*.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              message:
                'Regla de Dependencia violada: El Dominio es agnóstico a la UI y no debe importar "react".',
            },
            {
              name: 'react-native',
              message:
                'Regla de Dependencia violada: El Dominio es agnóstico a la plataforma y no debe importar "react-native".',
            },
            {
              name: 'expo',
              message:
                'Regla de Dependencia violada: El Dominio no debe acoplarse al framework "expo".',
            },
            {
              name: 'expo-router',
              message:
                'Regla de Dependencia violada: El Dominio no debe acoplarse al enrutador "expo-router".',
            },
          ],
          patterns: [
            {
              group: ['react-native-*', 'expo-*', '@expo/*'],
              message:
                'Regla de Dependencia violada: El Dominio no debe importar bibliotecas de UI ni de infraestructura.',
            },
            {
              group: [
                '**/application/**',
                '**/application',
                '**/infrastructure/**',
                '**/infrastructure',
                '**/composition/**',
                '**/composition',
                '@composition/*',
                '@composition',
                '@contexts/*',
                '@contexts',
              ],
              message:
                'Regla de Dependencia violada: El Dominio no debe importar capas externas (application, infrastructure, composition) ni otros contextos.',
            },
            {
              group: [
                '../*application*',
                '../*infrastructure*',
                '../*composition*',
              ],
              message:
                'Regla de Dependencia violada: Prohibido importar capas externas mediante rutas relativas desde el Dominio.',
            },
          ],
        },
      ],
    },
  },
]);
