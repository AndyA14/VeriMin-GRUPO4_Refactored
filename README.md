# VeriMind Analytics — Expo / React Native

**Universidad Central del Ecuador · Facultad de Ingeniería y Ciencias Aplicadas · Sistemas de Información**  
**Asignatura:** Dispositivos Móviles · **Grupo 4**  
**Integrantes:** Andrés Aucancela, Carlos Patiño, Joseph Ponce y Petter Rodriguez  
**Docente:** Ing. Diego Noguera

> **Alcance académico:** prototipo de **frontend móvil interactivo** construido con React Native y Expo Router. Su objetivo es demostrar interfaces, navegación, organización por componentes, modelado DDD y arquitectura hexagonal **mediante lógica local, datos ilustrativos y adaptadores simulados**. No se exige ni se afirma un backend productivo.

> **Corte de revisión documental:** 25 de noviembre de 2026 (hora de Ecuador). Se consultaron el árbol de `main` (commit `ba37ed4`) y los PRs #1–#14: **todos figuran fusionados** en el corte. Los PRs #10 (responsive/JSDoc), #11 (documentación) y #12 (app/tema/script de pruebas) forman parte de la rama principal. Las pruebas (15 suites, 63 casos) se ejecutaron con `npm test` en esa fecha y **aprobaron**.

## Navegación rápida

- [Problema y alcance](#problema-y-alcance)
- [Research competitivo](#documentación-en-confluence)
- [Atomic Design y Figma](#información-técnica-ampliada)
- [Diseño DDD](#ddd-y-lenguaje-ubicuo)
- [Arquitectura hexagonal](#arquitectura-hexagonal)
- [Estado técnico y simulaciones](#estado-técnico-y-simulaciones)
- [Responsabilidades y Pull Requests](#equipo-y-trabajo-colaborativo)
- [Documentación Confluence (bloques A–E)](#documentación-en-confluence)
- [Detalles: instalación, pantallas, estructura y scripts](#información-técnica-ampliada)

## Problema y alcance

**Problema:** las marcas que consideran colaboraciones con creadores de contenido necesitan interpretar señales sobre audiencia, publicaciones y clima de comentarios. La información está dispersa y una métrica aislada, como número de seguidores, no basta para sustentar una evaluación.

**Research de soluciones similares:** el equipo documentó un análisis comparativo de plataformas existentes (HypeAuditor, Modash, Heepsy y otras), disponible en Confluence. El estudio identifica referentes, no demuestra que VeriMind supere sus prestaciones.

**Propuesta:** una aplicación móvil que muestra un flujo de consulta y resultados ilustrativos de perfiles públicos (referencia principal: TikTok), con indicadores estadísticos, resúmenes visuales y módulos de apoyo. **No es una auditoría real ni una herramienta de diagnóstico psicológico.**

| Dimensión del prototipo | Qué se muestra | Fuente y límite |
|---|---|---|
| Autenticidad estadística | Resultado Benford, χ² y señal de anomalía | Datos simulados; una anomalía no demuestra bots o fraude |
| Riesgo del perfil | Porcentaje y nivel bajo/medio/elevado | Umbrales definidos en código; el porcentaje es ilustrativo |
| Comentarios hostiles | Cantidad observada / total | Valores de muestra; negatividad ≠ acoso |
| Big Five | Gráfica de cinco rasgos | Porcentajes predefinidos de `content.ts`; no diagnóstico |
| Audiencia | Edades e intereses | Datos ilustrativos de interfaz |
| Informe y asistente | Pantallas con contenido y respuestas | Chat con respuestas predefinidas; PDF simulado |
| Planes y pago | Selección de plan y confirmación local | No hay cobros reales ni backend |

**Origen de datos:** varias pantallas consultan contenido estático de `src/data/content.ts`; por separado, `ExtractorMock` devuelve datos ilustrativos definidos directamente en el adaptador (no importa `content.ts`). El `@usuario` se normaliza pero **no dispara extracción real de TikTok**; el extractor devuelve métricas ilustrativas para la cuenta solicitada.

## DDD y lenguaje ubicuo

**Domain-Driven Design (DDD)** guía la organización del modelo. El **Core Domain** adoptado para el ejercicio es la evaluación de cuentas de creadores; la arquitectura se materializa principalmente en los contextos `analisis` e `identity`.

### Lenguaje ubicuo — términos esenciales

| Término del negocio | Significado en VeriMind | Correspondencia actual |
|---|---|---|
| Marca | Organización interesada en un creador para colaboración | Actor de negocio; no agregado implementado |
| Creador | Persona cuyo perfil público se analiza | Representado por `CuentaCreador` |
| Cuenta de creador | Datos de perfil e indicadores del análisis | `CuentaCreador` (raíz de agregado) |
| Handle | Identificador público normalizado con `@` | `Handle` (objeto de valor) |
| Análisis | Acción de consultar la cuenta de demostración | `AnalizarCuenta` (caso de uso) |
| Resultado | Última cuenta analizada disponible | `ObtenerResultado`, repositorio en memoria |
| Prueba de Benford | Estadístico χ² y comparación con valor crítico | `PruebaBenford` (objeto de valor) |
| Riesgo | Porcentaje indicativo y su categoría | `NivelRiesgo` (objeto de valor) |
| Comentarios hostiles | Conteo que cumple `0 ≤ cantidad ≤ total` | `CuentaCreador.comentariosHostiles` |
| Usuario | Identidad local del prototipo | `Usuario` del contexto `identity` |
| Plan y suscripción | Oferta y estado comercial mostrados en pantalla | Datos locales; contexto `facturacion` no implementado |

La [definición ampliada del lenguaje ubicuo](https://verimind.atlassian.net/wiki/external/YmNmODNlYzJhYWNkNGI5OGJhNDEwOGNjZjQ4ZTRiZjE) está en Confluence. Debe mantenerse coherente con los nombres de código, aunque los términos de negocio estén en español y algunas carpetas en inglés.

### Diseño estratégico — Bounded Contexts

| Contexto o capacidad | Clasificación conceptual | Estado en `main` |
|---|---|---|
| **Análisis de creadores** | Core Domain | **Implementado**: dominio, casos de uso, adaptadores y tests |
| **Identidad y acceso** | Generic | **Implementado como simulación local**, sin autenticación real |
| **Facturación / suscripciones** | Generic | **No implementado como dominio**; planes y pago en UI/estado local |
| Adquisición y normalización de datos | Supporting | **Capacidad mediante un puerto y un mock** dentro de `analisis`; no BC autónomo implementado |
| Informes y asistencia a decisiones | Supporting | Pantallas React Native; **sin BC independiente** |
| Apoyo al creador | Supporting, por validar | Pantalla y contenido ilustrativo; **sin BC independiente** |
| Notificaciones | Generic, por validar | Avisos/Toast de interfaz; **sin BC independiente** |

**Importante:** subdominio, Bounded Context, carpeta y pantalla no son sinónimos. La clasificación de capacidades complementarias es una propuesta documental y no significa que existan siete Bounded Contexts implementados.

### Diseño táctico — elementos implementados

| Elemento | Dominio / aplicación | Estado |
|---|---|---|
| `CuentaCreador` | Entidad raíz de agregado con validaciones de publicaciones y comentarios | En `main` |
| `Handle` | Value Object que normaliza la cuenta | En `main` |
| `NivelRiesgo` | Value Object, categorías: bajo `<35`, medio `35–64`, elevado `≥65` | En `main` |
| `PruebaBenford` | Value Object, χ² contra valor crítico `20.09`; método `desdeMetricas` | En `main`; mock actual usa `PruebaBenford.crear(24.51, 20.09)` |
| `AnalizarCuenta` | Caso de uso que valida handle y consulta extractor/repositorio | En `main` |
| `ObtenerResultado` | Caso de uso que devuelve el último resultado en memoria | En `main` |
| `Email`, `Contrasena`, `Usuario` | Objetos de valor y entidad del contexto de identidad | En `main` |
| `IniciarSesion` | Caso de uso de acceso local; registra usuario si no existe | En `main`, **sin verificación de contraseña almacenada** |
| `Plan`, `Suscripcion`, `ActivarPlan` de dominio | Modelos previstos de facturación | **No implementados** en `src/contexts/facturacion` |

**Precisión estadística:** `PruebaBenford.desdeMetricas` permite calcular χ² a partir del primer dígito de **30 o más métricas válidas**, comparado con la distribución teórica; el código establece un crítico por defecto de 20,09, 8 grados de libertad y significancia del 1 %. Esto **no verifica** por sí solo que métricas reales de una red social cumplan los supuestos de Benford.

## Arquitectura hexagonal

La solución organiza reglas y casos de uso separándolos de la interfaz Expo y los adaptadores concretos:

```text
      React Native / Expo Router (adaptador de entrada)
                         │
                         ▼
        Aplicación: AnalizarCuenta / ObtenerResultado
                    IniciarSesion
                         │
                         ▼
        Dominio: CuentaCreador, Handle, NivelRiesgo,
                 PruebaBenford, Usuario, Email…
                         ▲
            Puertos (interfaces del núcleo)
                         ▲
        Infraestructura: ExtractorMock,
              repositorios en memoria

    src/composition/container.ts ensambla las dependencias.
```

| Evidencia | Ubicación |
|---|---|
| Núcleo compartido (`Entity`, `ValueObject`, `Result`, `DomainEvent`) | `src/shared/domain/` |
| Contrato compartido `CasoDeUso` | `src/shared/application/` |
| Bounded Context de análisis | `src/contexts/analisis/` |
| Bounded Context de identidad | `src/contexts/identity/` |
| Composición de dependencias | `src/composition/container.ts` |
| Restricciones de importación del dominio | `eslint.config.js` |
| Pruebas Jest | `src/**/__tests__/` |

La **arquitectura hexagonal se aplica en el frontend**, con dominio y aplicación TypeScript locales. No implica que exista API, servidor, base de datos externa o microservicios. La abstracción de puertos permite sustituir mocks en el futuro sin acoplar el dominio a proveedores.

## Estado técnico y simulaciones

| Característica | Estado y alcance |
|---|---|
| Navegación por pantallas | Implementada con Expo Router |
| **Atomic Design** | Diseño de componentes y tokens documentado en [Figma y Confluence](https://verimind.atlassian.net/wiki/external/NTcyNTMxMjJlYmZmNDY1MjlmY2ZiZWE1NjY1NjhhNzM); clasificación lógica de átomos, moléculas, organismos, plantillas y pantallas |
| Login | Caso de uso local; verifica formato y longitud, **no credenciales reales** |
| Análisis de perfiles | Caso de uso real sobre **datos de prueba fijos** |
| Benford | Existe cálculo estadístico en dominio; **el flujo mock usa χ² precalculado** |
| Riesgo y comentarios | Reglas/invariantes locales; valores de muestra |
| Chat | Respuestas locales predefinidas (`chatSeed`); no consulta un servicio de IA externo |
| Informes y PDF | Pantalla ilustrativa; el botón de PDF muestra Toast, no crea archivo |
| Planes/pago | Flujos visuales, no facturación de producción |
| Adaptación 9:16, 16:9 y 1:1 | **Cambios integrados mediante PR #10.** Aún se necesitan capturas/pruebas específicas para acreditar cada formato; `app.json` mantiene `orientation: portrait`. |
| Pruebas | Jest, lint y typecheck configurados; `npm test` ejecutado el 25/11/2026 sobre `ba37ed4`: **15 suites y 63 pruebas aprobadas**. No hay pruebas automáticas de pantallas ni de responsive |

> **Diferencia importante:** 393 × 852 representa aproximadamente **9:19,5**, no 9:16 exacto. También **18:9 no es 16:9**. Aunque el PR #10 introduce adaptación por dimensiones, cada proporción exigida debe comprobarse mediante capturas o ejecución.

## Equipo y trabajo colaborativo

| Integrante | Actividad documentada | PR / estado |
|---|---|---|
| Andrés Aucancela (`AndyA14`) | Shared Kernel, composición, arquitectura y reglas lint; mejoras responsive y JSDoc | [#1 fusionado](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/1), [#10 fusionado](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/10) |
| Carlos Patiño (`carlos-1200pro`) | Contexto de análisis, invariantes, puertos, mocks, casos de uso y pantallas conectadas | [#3 fusionado](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/3) |
| Joseph Ponce (`JosephP2001`) | Identidad y acceso; Benford desde métricas; documentación e integración | [#4 fusionado](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/4), [#5](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/5), [#6](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/6), [#8](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/8), [#9](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/9) fusionados |
| Petter Rodriguez (`Petterouski`) | README, documentación técnica y coordinación de Confluence | [#2 fusionado](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/2), [#11 fusionado](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/11) |

### Ramas principales por integrante

| Integrante | Ramas registradas |
|---|---|
| Andrés Aucancela | `feat/ddd-shared-kernel`, `fix-responsive-and-comments` |
| Carlos Patiño | `feat/ddd-context-analisis` |
| Joseph Ponce | `feat/ddd-context-identity`, `docs/readme-completo`, `feat/benford-desde-metricas`, `fix/restaurar-benford`, `feat/login-validacion`, `chore/scripts-calidad`, `chore/app-config-y-test` |
| Petter Rodríguez | `Petter` (documentación) |

**Nota:** algunas ramas corresponden al trabajo inicial del repositorio original y otras al refactorizado; consultar el PR de cada cambio para atribuirlo correctamente.

**Contribución adicional:** el PR [#12](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored/pull/12) (Joseph) integra el nombre VeriMind Analytics, tema oscuro y script `npm test`. **Flujo:** feature branches, commits por responsabilidad, PRs a `main`, revisión y fusión. El historial de GitHub es la evidencia de integración. El PR #7 fue un revert temporal de Benford, seguido por su reaplicación en el PR #9.

## Documentación en Confluence

La documentación técnica principal se organiza en los bloques A–E de Confluence. Se enlazan las **URL de uso compartido externo** (`/wiki/external/`) facilitadas por el equipo y publicadas en el índice. Para confirmar acceso sin cuenta, abrirlas en una ventana privada.

### Bloques principales

| Bloque | Documentación | Acceso compartido |
|---|---|---|
| A | Contexto, definición del problema, actores, AS-IS, TO-BE y Research | [Abrir Bloque A](https://verimind.atlassian.net/wiki/external/ZmFjNzVhZTM3NmIwNDJmYTk3MjAzOTk5Njk0Njg3NTE) |
| B | Lenguaje ubicuo, reglas e invariantes, subdominios y Context Map | [Abrir Bloque B](https://verimind.atlassian.net/wiki/external/NzJiOTU0OWMxY2RjNGIwMmJmZmUzYWRkN2M0MWRmNGU) |
| C | Diseño táctico: agregados, entidades, objetos de valor y casos de uso | [Abrir Bloque C](https://verimind.atlassian.net/wiki/external/MTAxYjM0NGJiNzYzNDQwMWI5MTJhMjQ3Y2M2ZmJlNTY) |
| D | Arquitectura hexagonal, Atomic Design, Figma, navegación y ADRs | [Abrir Bloque D](https://verimind.atlassian.net/wiki/external/NmQ1MGM5YWRiMjIyNDc0ODkxMTBlNDNjNjNmYjIxNDc) |
| E | Pruebas, evidencias y organización del desarrollo | [Abrir Bloque E](https://verimind.atlassian.net/wiki/external/OGEzNTc1MGFjNmJmNDViZGEzNDJkNzdmNTQ5MzhiM2M) |

### Documentos de consulta directa

| Recurso | Enlace compartido |
|---|---|
| **Definición del problema** | [Consultar](https://verimind.atlassian.net/wiki/external/MjFmMWMzZWU1NGY2NGRkZDkwZjVmODc1OWRmYWYyMzQ) |
| **Proceso AS-IS** | [Consultar](https://verimind.atlassian.net/wiki/external/OGJiNGQ1NmU3YjMzNGY3MDlmYjljMTdiNDE4MTBiZmE) |
| **Proceso TO-BE** | [Consultar](https://verimind.atlassian.net/wiki/external/ODRjMDc2NjA1YTE3NDEzZmE5YmJmMTNlYjhjNzA4Y2Y) |
| **Research competitivo** | [Investigación de soluciones similares](https://verimind.atlassian.net/wiki/external/MzZmNjIzYjIwZjU2NDFkMGJmYWY0NmU3ZmQ1YWVkMGU) |
| Lenguaje ubicuo ampliado | [Consultar](https://verimind.atlassian.net/wiki/external/YmNmODNlYzJhYWNkNGI5OGJhNDEwOGNjZjQ4ZTRiZjE) |
| Reglas e invariantes | [Consultar](https://verimind.atlassian.net/wiki/external/ZGRjNzgwYzdhMzU3NDdmZTg1ZTEzYzFmMjlkMjkzZDk) |
| Subdominios | [Consultar](https://verimind.atlassian.net/wiki/external/MTJmOGZhMmRlM2MyNGI1N2JhODZkMGI3NTkxYjc1ZDM) |
| Bounded Contexts y Context Map | [Consultar](https://verimind.atlassian.net/wiki/external/MzQwODc3MDRhZDFjNDZkMDgyOTIxYTk2MDMzYTZjYmI) |
| Agregados y entidades | [Consultar](https://verimind.atlassian.net/wiki/external/YWJjYjAxOTQ0Njc4NDAwZmExOGZhYmMzYjc5NTc1ZDQ) |
| Objetos de valor | [Consultar](https://verimind.atlassian.net/wiki/external/YzAxZjY3NDgyYjZkNDkzNmIwNDkxN2MzODc4MmJlYzU) |
| Casos de uso | [Consultar](https://verimind.atlassian.net/wiki/external/NWYxMzA3YWUxNDRlNDUyYmJkNDMwMWU5MzJkODI5ZGM) |
| Arquitectura hexagonal | [Consultar](https://verimind.atlassian.net/wiki/external/MGY1ZjViZDc3ZWQyNGMxOWE4YzQyOGE3NGZkYmVhMDM) |
| **Atomic Design y Figma** | [Consultar](https://verimind.atlassian.net/wiki/external/NTcyNTMxMjJlYmZmNDY1MjlmY2ZiZWE1NjY1NjhhNzM) |
| Prototipo y navegación | [Consultar](https://verimind.atlassian.net/wiki/external/MzI5M2ZhMDk1MmNlNDkzZWE0ZDY5YTU2YWJmM2ZlYjc) |
| Pruebas y verificación | [Consultar](https://verimind.atlassian.net/wiki/external/M2M5NzdmZGQyNWI4NDUxYTkyMWEyM2M1YmM4NTk2NjI) |
| Organización del desarrollo | [Consultar](https://verimind.atlassian.net/wiki/external/NmQ5NjY4YzNlN2RhNDVmZGFhMjZmMzQ0ZjNjM2Y0Y2U) |

**Material documental previo:** las primeras páginas de lenguaje ubicuo, diseño estratégico, diseño táctico, arquitectura y organización siguen disponibles como antecedentes del proyecto. Los bloques A–E constituyen el punto de navegación recomendado.

### Enlaces del proyecto

| Recurso | Enlace |
|---|---|
| Repositorio refactorizado | [Ver GitHub](https://github.com/AndyA14/VeriMin-GRUPO4_Refactored) |
| Repositorio anterior | [Ver GitHub](https://github.com/AndyA14/VeriMind-Gmoviles) |
| Diseño y prototipos en Figma | [Abrir archivo Moviles](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=161-131) |
| Jira | Tablero KAN: requiere cuenta Atlassian del proyecto; la organización del trabajo está documentada en el Bloque E de Confluence |
| Página de enlaces de Confluence | [Abrir](https://verimind.atlassian.net/wiki/external/NjU3YzNlODk3NTE1NDcxZDk4OGJhYjc2MzE0MDM2MWM) |

## Información técnica ampliada

Las siguientes secciones pueden **desplegarse y contraerse** en la vista de GitHub. Mantienen el detalle de tecnologías, archivos, pantallas e instalación del README anterior.


<details>
<summary><strong>IA utilizadas por los integrantes del Grupo</strong></summary>

## IA utilizadas por los integrantes del Grupo

- **Andy:** Claude Sonnet 5.5 y Gemini Flash 3.8
- **Carlos:** Claude Sonnet 5.5
- **Joseph:** Claude Opus 5.5
- **Petter:** Chat GPT

---

</details>

<details>
<summary><strong>Diseño en Figma</strong></summary>

## Diseño en Figma

El archivo «Moviles» documenta componentes reutilizables y el prototipo. Los enlaces por nodo permiten acceder directamente a los formatos considerados por el equipo.

| Recurso | Enlace |
|---|---|
| Archivo general | [Figma «Moviles»](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=161-131) |
| **Diseño 9:16** | [Nodo 161-134](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=161-134) |
| **Diseño 16:9** | [Nodo 161-135](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=161-135) |
| **Diseño 1:1** | [Nodo 161-136](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=161-136) |
| Atomic Design | [Documentación en Confluence](https://verimind.atlassian.net/wiki/external/NTcyNTMxMjJlYmZmNDY1MjlmY2ZiZWE1NjY1NjhhNzM) |

**Nota:** los nodos anteriores fueron indicados por el equipo; verificar en Figma que cada uno corresponde a la proporción señalada y que existe una variante de las pantallas esperadas. El código responsive integrado y el diseño no sustituyen la evidencia de pruebas visuales.

---

</details>

<details>
<summary><strong>Estado del Proyecto y Arquitectura</strong></summary>

## Estado del Proyecto y Arquitectura

La aplicación es un prototipo interactivo funcional desarrollado con **Expo Router** y **React Native**. Integra un flujo completo de auditoría para cuentas de redes sociales (TikTok), desde un formulario de acceso con validación local hasta búsqueda de perfiles, simulación de procesamiento y visualización de indicadores (Benford, Big Five y comentarios), informes en pantalla, recursos de apoyo, chat simulado y selección de planes con pago simulado. Los datos ilustrativos provienen del adaptador `ExtractorMock` y, en otras pantallas, de `src/data/content.ts`.

### Características Principales Implementadas

- **Validación de formulario (sin autenticación real):** `IniciarSesion` valida `Email` y `Contrasena` (al menos 6 caracteres), crea usuarios en memoria al primer acceso y devuelve un nombre para personalizar la interfaz; no verifica contraseñas guardadas.
- **Flujo Dinámico de Usuario:** El handle ingresado en la búsqueda (`@usuario`) se normaliza y propaga globalmente a través del estado (`AppState`), reflejándose en las pantallas de Resultado y Chat.
- **Procesamiento Animado:** Pantalla de análisis por etapas con barra de progreso animada continua (`Animated`), spinner personalizado e inspección visual simulada de publicaciones.
- **Asistente Interactivo Simulado:** Chat local con envío de mensajes, scroll automático y respuestas predefinidas de `chatSeed`; no utiliza un modelo de IA externo.
- **Informes y Métricas Simulados:** Visualización de proporciones Big Five y rangos de edad mediante gráficos de barras apiladas (`StackedBar`), métricas de riesgo y anomalías de Benford.
- **Módulo de Apoyo al Creador:** Selector reactivo de casos de riesgo (acoso, tensión) y panel deslizable (`BottomSheet`) con recursos y canales de ayuda.
- **Planes y Suscripción Simulados:** Selección de planes (Gratis, Esencial, Profesional y Agencia), pasarela simulada con métodos de pago (tarjeta/transferencia) y sistema de notificaciones flotantes (*Toast*).
- **Control de calidad disponible:** TypeScript, ESLint, validación arquitectónica y pruebas Jest definidas en `package.json`. `npm test` ejecutado el 25 de noviembre de 2026 sobre `ba37ed4`: 15 suites y 63 pruebas aprobadas.

---

</details>

<details>
<summary><strong>Stack y versiones instaladas</strong></summary>

## Stack y versiones instaladas

- **Expo SDK:** `~58.0.25`
- **Expo Router:** `~58.0.31`
- **React / React Native:** `19.3.0` / `0.88.1`
- **TypeScript:** `~6.0.3`
- **Linter:** `eslint` (`^9.0.0`) + `eslint-config-expo` (`~58.0.4`)
- **UI e Iconografía:** `lucide-react-native`, `react-native-svg`, `@expo-google-fonts/inter`
- **Áreas Seguras y Navegación:** `react-native-safe-area-context`, `react-native-screens`
- **Soporte web:** `react-dom` `19.3.0`, `react-native-web` `^0.21.4`

---

</details>

<details>
<summary><strong>1. Instalación en un entorno nuevo</strong></summary>

## 1. Instalación en un entorno nuevo

El proyecto cuenta con su estructura base y dependencias declaradas en `package.json`. Para instalar las dependencias en una instalación limpia o nuevo clon:

```bash
npm ci
```

**Recomendación:** para instalaciones reproducibles, si existe `package-lock.json`, usar `npm ci`. Si aparecen conflictos de versiones, revisar primero la compatibilidad de dependencias con Expo antes de usar opciones que omitan comprobaciones de dependencias.

---

</details>

<details>
<summary><strong>2. Configuración de Expo Router</strong></summary>

## 2. Configuración de Expo Router

- En `package.json`: `"main": "expo-router/entry"`.
- En `app.json`, dentro de `"expo"`:
  - `"scheme": "verimind"`
  - `"userInterfaceStyle": "dark"`
  - `"plugins": ["expo-router"]`
- Enrutamiento basado en archivos ubicado bajo el directorio `src/app/` con soporte para transiciones y layout raíz (`src/app/_layout.tsx`).

---

</details>

<details>
<summary><strong>3. Scripts de Desarrollo y Calidad</strong></summary>

## 3. Scripts de Desarrollo y Calidad

Disponibles en `package.json`:

```bash
# Iniciar el servidor de desarrollo de Expo
npm run start       # o npx expo start

# Ejecución en plataformas específicas
npm run android     # Inicia en Android / emulador
npm run ios         # Inicia en simulador de iOS (requiere macOS)
npm run web         # Inicia versión web (react-dom y react-native-web están declarados)

# Verificación de tipos y linting
npm run typecheck   # Ejecuta validación estricta de TypeScript (tsc --noEmit)
npm run lint        # Valida estilo de código con ESLint
npm run lint:arch   # Ejecuta ESLint sobre src (incluye reglas de dependencia)
npm run test:domain # Ejecuta pruebas de dominio
npm test            # Ejecuta todas las pruebas Jest
```

---

</details>

<details>
<summary><strong>4. Recursos Gráficos (`assets/images/`)</strong></summary>

## 4. Recursos Gráficos (`assets/images/`)

Las imágenes del proyecto se encuentran organizadas en `assets/images/`:

| Archivo            | Uso en la aplicación                                                     |
|--------------------|--------------------------------------------------------------------------|
| `login-hero.png`   | Imagen de cabecera editorial en la pantalla de inicio de sesión          |
| `profile.png`      | Fotografía del perfil del creador analizado                              |
| `post-1/2/3.png`   | Miniaturas ilustrativas de publicaciones en la pantalla de procesamiento |

El desenfoque (`blurRadius={1.5}`) y la opacidad (`70 %`) de las miniaturas en la carga son aplicados directamente por el código.

---

</details>

<details>
<summary><strong>5. Mapa pantalla → archivo</strong></summary>

## 5. Mapa pantalla → archivo

| Frame de Figma                                  | Ruta / archivo                      | Descripción y Estado |
|-------------------------------------------------|-------------------------------------|----------------------|
| Login corporativo                               | `src/app/index.tsx`                 | Formulario con validación de correo corporativo y contraseña (mínimo 6 caracteres), extrae el nombre del usuario |
| Búsqueda y extracción                           | `src/app/buscar.tsx`                | Saludo personalizado (`¡Hola {userName}!`), tag de estado del plan y buscador de `@usuario` de TikTok |
| Procesamiento 1/3, 2/3, 3/3                     | `src/app/procesando.tsx`            | Pantalla continua animada (progreso y spinner) con avance automático en 3 etapas |
| Resultado del análisis                          | `src/app/resultado.tsx`             | Resumen dinámico del handle, métricas de riesgo y accesos a submódulos |
| Asistente                                       | `src/app/chat.tsx`                  | Chat interactivo, burbujas con nombre de usuario, autoscroll y notificación demostrativa de reporte PDF |
| Informe para la empresa (IA)                    | `src/app/informe.tsx`               | Resumen ejecutivo, gráfica Big Five (`StackedBar`), test de Benford y botón de reporte que muestra un Toast (sin archivo PDF real) |
| Apoyo al creador (acoso / tono / malestar)      | `src/app/apoyo.tsx`                 | Selector de casos con chips y recomendaciones adaptadas |
| Recursos de apoyo (panel)                       | `BottomSheet` dentro de `apoyo.tsx` | Hoja modal inferior con líneas de ayuda y recomendaciones |
| Público del creador                             | `src/app/publico.tsx`               | Distribución por edades (`StackedBar`), tags de interés y potencial comercial |
| Planes                                          | `src/app/planes.tsx`                | Selector de planes con confirmación inmediata del plan gratuito o pase a pasarela |
| Pago                                            | `src/app/pago.tsx`                  | Resumen del plan, selector de método (tarjeta/transferencia) y activación en estado |
| Avisos y notificaciones (Toast)                | `src/state/AppState.tsx`            | Banner animado superior con `BadgeCheck` para confirmar acciones clave |

**Flujo de navegación:**
`Login` → `Búsqueda` → `Procesamiento` → `Resultado` → (`Chat` · `Informe` · `Público` · `Apoyo`).
Desde `Búsqueda`: → `Planes` → `Pago` → Retorno a `Búsqueda` con plan actualizado.

---

</details>

<details>
<summary><strong>6. Estructura del proyecto</strong></summary>

## 6. Estructura del proyecto

```text
assets/
  images/               Recursos gráficos (login-hero, post-1/2/3, profile) e íconos
src/
  app/                  Rutas y pantallas navegables (Expo Router)
    _layout.tsx         Layout raíz con fuentes Inter, Theme Provider y StatusBar
    index.tsx           Login corporativo con validación
    buscar.tsx          Buscador de cuenta y centro de auditoría
    procesando.tsx      Pantalla de carga secuencial con barra animada
    resultado.tsx       Vista general de resultados y métricas
    chat.tsx            Asistente conversacional interactivo
    informe.tsx         Informe para empresas con gráficos Big Five
    apoyo.tsx           Guía de apoyo al creador y casos de acoso
    publico.tsx         Análisis demográfico y de audiencia
    planes.tsx          Catálogo de planes y suscripciones
    pago.tsx            Pasarela y confirmación de pago
  components/           Componentes modulares reutilizables
    ActionCard.tsx      Tarjeta interactiva de navegación
    AlertCard.tsx       Tarjeta de advertencia y anomalías detectadas
    BottomSheet.tsx     Panel modal deslizable inferior
    BrandMark.tsx       Isotipo de marca VeriMind
    Button.tsx          Botón adaptable (primario, outline, compact)
    Card.tsx            Contenedor con bordes y tonos personalizables
    Chip.tsx            Píldora seleccionable para filtros y métodos
    Field.tsx           Campo de entrada de texto con icono integrado
    IconRow.tsx         Fila informativa con icono temático
    Logo.tsx            Identidad corporativa completa
    NavBar.tsx          Barra de navegación superior con retroceso
    ProfilePhoto.tsx    Avatar de usuario con marco decorativo
    Screen.tsx          Layout contenedor base con soporte para scroll y footer fijo
    Spinner.tsx         Indicador circular de carga estilizado
    StackedBar.tsx      Gráfica de barras segmentadas apiladas
    StatusTag.tsx       Etiqueta de estado por tono (info, peligro, advertencia, éxito)
  contexts/
    analisis/
      domain/            CuentaCreador, Handle, PruebaBenford, NivelRiesgo y puertos
      application/       AnalizarCuenta, ObtenerResultado
      infrastructure/    ExtractorMock, RepositorioAnalisisEnMemoria
    identity/
      domain/            Email, Contrasena, Usuario y puerto de usuarios
      application/       IniciarSesion
      infrastructure/    RepositorioUsuarioEnMemoria
    facturacion/         Directorios preparados; sin lógica de dominio en main
  shared/
    domain/              Entity, ValueObject, Result, DomainEvent
    application/         CasoDeUso
  composition/           Inyección y ensamblaje de adaptadores/casos de uso
  data/
    content.ts          Datos ilustrativos de interfaces (Big Five, planes, apoyo...)
  state/
    AppState.tsx        Contexto global: plan activo, usuario logueado, handle y toast
  theme/
    index.ts            Tokens de diseño: paleta de colores, tipografía, espaciados y radios
  utils/
    formato.ts          Funciones de validación de correo, extracción de nombres y normalización de handles
eslint.config.js        Configuración de ESLint (flat config)
package.json            Dependencias, metadatos y scripts
tsconfig.json           Configuración del compilador de TypeScript
app.json                Configuración de la aplicación Expo
```

---

</details>

<details>
<summary><strong>7. Decisiones de implementación y estado del código</strong></summary>

## 7. Decisiones de implementación y estado del código

- **Inicio de sesión simulado mediante un caso de uso:** `IniciarSesion` valida `Email` y `Contrasena` (al menos seis caracteres) y crea un `Usuario` en el repositorio en memoria cuando no existe. **No comprueba contraseñas contra credenciales registradas ni constituye autenticación real.**
- **Estado local y casos de uso:** `AnalizarCuenta` utiliza `Handle.crear`, obtiene la cuenta de `ExtractorMock` y guarda el resultado con `RepositorioAnalisisEnMemoria`; `ObtenerResultado` consulta el último resultado. `AppState` mantiene información visual del flujo. Los datos se pierden al cerrar/reiniciar la aplicación.
- **Simulación del Asistente (sin IA conectada):** El chat permite enviar mensajes en tiempo real, añade las intervenciones a una lista local, efectúa desplazamiento automático y muestra respuestas locales predefinidas (con retraso realista de 600 ms) sin requerir servicios externos de terceros ni claves de API.
- **Reporte PDF (simulado):** Al pulsar el botón de descarga se presenta una notificación flotante (*Toast*); el código revisado no crea ni descarga un archivo PDF.
- **Animaciones e Interacciones:** La etapa de procesamiento emplea animación fluida a través de la API `Animated` de React Native para el llenado de la barra según los pasos estipulados en el diseño.
- **Pasarela de Pagos (simulada):** La pantalla de pagos permite alternar entre tarjeta y transferencia bancaria, reflejando el cambio de estado tanto en el chip de la pantalla de búsqueda como en el contexto global de la aplicación.

</details>

<details>
<summary><strong>Mantenimiento de la documentación</strong></summary>

## Mantenimiento de la documentación

La documentación debe actualizarse **después de integrar cambios de código** y comprobar los cambios de dominio y arquitectura con los PRs. No basta con que exista un archivo, interfaz o rama para declarar completa una funcionalidad. Las páginas de Confluence detallan el diseño; este README resume el estado verificado. Las afirmaciones de implementación deben corresponder a la rama de entrega y acompañarse de evidencia.

</details>
