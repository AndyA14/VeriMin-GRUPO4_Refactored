# VeriMind Analytics — Expo (React Native)

**Universidad Central del Ecuador · Facultad de Ingeniería y Ciencias Aplicadas · Sistemas de Información**
**Dispositivos Móviles · Grupo 4**

**Integrantes:** Andrés Aucancela, Carlos Patiño, Joseph Ponce y Petter Rodriguez
**Docente:** [COMPLETAR]

Aplicación móvil (React Native + Expo) para auditar perfiles públicos de creadores de contenido, construida a partir del prototipo de Figma «Moviles» y reorganizada con **Domain-Driven Design (DDD) y arquitectura hexagonal**.

## Enlaces del proyecto

| Recurso | Enlace |
|---|---|
| Repositorio de entrega (GitHub) | https://github.com/AndyA14/VeriMin-GRUPO4_Refactored |
| Repositorio original (versión previa a la refactorización) | https://github.com/AndyA14/VeriMind-Gmoviles |
| Diseño en Figma («Moviles — VeriMind») | https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=0-1&t=jTQnLaIv0eh2W7GM-1 |
| Lenguaje ubicuo (Confluence) | https://verimind.atlassian.net/wiki/external/YmJkNDI4NjQ3NDhhNDgyMDhjMWVjODVmNWZhMmM3N2I |
| Diseño estratégico DDD (Confluence) | https://verimind.atlassian.net/wiki/external/YzRjMmE4NDNhOGM5NDJkN2JjMDlhMjRjZDRkYmM0M2M |
| Diseño táctico DDD (Confluence) | https://verimind.atlassian.net/wiki/external/N2ZjOTc4ZDk3ODgwNGZmYzgwMTlmNzAzYTcxMWMxMmY |
| Arquitectura hexagonal (Confluence) | https://verimind.atlassian.net/wiki/external/ZGM2ZjdjZDBkZTgzNDhmODgwNmRjMmNkOTcxZWI3ZmQ |
| Organización del desarrollo (Confluence) | https://verimind.atlassian.net/wiki/external/ZjRjMzk5NzgwMWZhNDVhYzg0ODE1ZTIzN2YxNzgwNjQ |
| Informe técnico | [COMPLETAR: enlace o ruta del documento] |

---

## 1. Problema, propósito y fuente de información

**Problema del negocio.** Las marcas que consideran colaborar con creadores de contenido necesitan interpretar varias señales sobre las cuentas y sus audiencias. La información fragmentada dificulta una evaluación consistente y transparente antes de una colaboración, y el número de seguidores por sí solo no refleja la actividad real de una comunidad.

**Propósito.** VeriMind Analytics organiza indicadores de perfiles públicos de creadores (principalmente TikTok) para apoyar la revisión de su audiencia, su comunicación y el clima de sus comentarios. Los resultados son orientativos: **no confirman fraude, no diagnostican personalidad ni determinan por sí solos la idoneidad para una campaña**.

**Análisis contemplados**

| Dimensión | Qué busca | Precaución |
|---|---|---|
| Autenticidad de la audiencia | Anomalías estadísticas (Ley de Benford) y proporciones de interacción | Una desviación de Benford no demuestra bots ni fraude |
| Perfil de comunicación (Big Five) | Rasgos orientativos del contenido | No es un diagnóstico psicológico |
| Clima de comentarios | Señales de hostilidad o acoso | Crítica, negatividad, insulto y acoso son cosas distintas |
| Público del creador | Edades e intereses | Depende de datos legítimos y suficientes |

**Fuente de la información.** *(Actualizar este apartado cuando el scraping esté integrado.)*
- **Hoy:** las pantallas obtienen los datos del adaptador `ExtractorMock`, que devuelve valores de demostración (los mismos de `src/data/content.ts`), sin importar el `@usuario` escrito.
- **Objetivo del proyecto:** extraer de forma real las métricas públicas de un perfil de TikTok (seguidores, publicaciones y métricas de hasta 30 videos) mediante un servicio de extracción, y calcular la prueba de Benford sobre esas métricas. El puerto `ExtractorCuentasPort` ya existe; el adaptador real se conecta sin modificar el dominio ni las pantallas.

---

## 2. Domain-Driven Design (DDD)

El proyecto aplica DDD como enfoque de modelado y de separación de responsabilidades.

**Core Domain:** evaluación de perfiles de creadores para apoyar decisiones de selección comercial.

### 2.1 Lenguaje ubicuo — resumen

| Término | Significado compartido |
|---|---|
| Marca | Organización que evalúa creadores para posibles colaboraciones. |
| Creador | Persona cuyo perfil público puede ser analizado. |
| Cuenta de creador | Perfil de una plataforma social identificado por un handle. |
| Handle | Identificador de la cuenta que se valida y normaliza (`@usuario`). |
| Análisis | Ejecución que procesa datos para obtener indicadores de una cuenta. |
| Resultado del análisis | Conjunto de indicadores y observaciones de una ejecución. |
| Anomalía | Desviación respecto de un criterio definido; **no equivale a fraude**. |
| Prueba de Benford | Comparación estadística exploratoria cuya aplicabilidad requiere justificación. |
| Perfil de comunicación / Big Five | Representación orientativa de cinco dimensiones; no es diagnóstico psicológico. |
| Clima de comentarios | Señales sobre tono y contenido; la crítica negativa no equivale a acoso. |
| Nivel de riesgo | Categoría que depende de reglas y umbrales definidos. |
| Plan / Suscripción | Oferta de acceso y relación del usuario con sus condiciones comerciales. |
| Usuario | Persona que accede a la plataforma con correo corporativo y contraseña. |

Definiciones completas y términos por validar: [Lenguaje ubicuo en Confluence](https://verimind.atlassian.net/wiki/external/YmJkNDI4NjQ3NDhhNDgyMDhjMWVjODVmNWZhMmM3N2I).

### 2.2 Diseño estratégico — Bounded Contexts

| Contexto | Clasificación | Responsabilidad | Carpeta en el código |
|---|---|---|---|
| Evaluación de influencers | **Core** | Coordinar el análisis y producir indicadores | `src/contexts/analisis` |
| Identidad y acceso | Generic | Usuarios y autenticación | `src/contexts/identity` |
| Suscripciones y facturación | Generic | Planes, suscripciones y pagos | `src/contexts/facturacion` |
| Adquisición y normalización de datos públicos | Supporting | Obtener y normalizar datos externos | Puerto `ExtractorCuentasPort` en `analisis` |
| Informes y asistencia a la decisión | Supporting | Presentar resultados (informe, chat) | Pantallas `informe` y `chat` |
| Apoyo al creador, Notificaciones | Supporting / Generic, por validar | Capacidades complementarias | Pantalla `apoyo` y avisos en `AppState` |

Context Map y relaciones: [Diseño estratégico en Confluence](https://verimind.atlassian.net/wiki/external/YzRjMmE4NDNhOGM5NDJkN2JjMDlhMjRjZDRkYmM0M2M).

### 2.3 Diseño táctico — lo que ya está implementado

| Contexto | Dominio | Aplicación | Infraestructura |
|---|---|---|---|
| **Análisis** | `CuentaCreador` (agregado), `Handle`, `PruebaBenford`, `NivelRiesgo`, puertos `ExtractorCuentasPort` y `RepositorioAnalisisPort` | `AnalizarCuenta`, `ObtenerResultado` | `ExtractorMock`, `RepositorioAnalisisEnMemoria` |
| **Identidad** | `Email`, `Contrasena` (value objects), `Usuario` (entidad), puerto `RepositorioUsuarioPort` | `IniciarSesion` | `RepositorioUsuarioEnMemoria` |
| **Facturación** | `Plan`, `Suscripcion` (previstos) | `ActivarPlan` (previsto) | Pasarela simulada (prevista) |
| **Shared Kernel** | `Entity`, `ValueObject`, `Result`, `DomainEvent` | `CasoDeUso` | — |

Modelo táctico detallado: [Diseño táctico en Confluence](https://verimind.atlassian.net/wiki/external/N2ZjOTc4ZDk3ODgwNGZmYzgwMTlmNzAzYTcxMWMxMmY).

---

## 3. Arquitectura hexagonal

```text
        Presentación (Expo Router / React Native)  ── adaptador de entrada
                          │  usa
                          ▼
                 composition/container.ts          ── raíz de composición
                          │  inyecta
        ┌─────────────────┴──────────────────┐
        │          Aplicación (casos de uso) │  ── puertos de entrada
        │          Dominio (reglas)          │  ── núcleo
        └─────────────────┬──────────────────┘
                          │  define puertos de salida (interfaces)
                          ▼
              Infraestructura (adaptadores)    ── memoria, mock, API de extracción
```

**Regla de dependencia:** las flechas apuntan hacia adentro. El dominio no importa React, React Native, Expo ni las capas de aplicación, infraestructura o composición. Está verificada automáticamente en `eslint.config.js` (`no-restricted-imports`).

### 3.1 Cómo se demuestra que se aplicó

| Evidencia | Dónde verla | Estado |
|---|---|---|
| Estructura por contexto y capa | `src/contexts/*/{domain,application,infrastructure}` | Hecho (análisis, identidad) |
| Regla de dependencia verificable | `eslint.config.js`; ejecutar `npx eslint src --no-cache` | Hecho |
| Pruebas de dominio y casos de uso sin React | Archivos `__tests__`; ejecutar `npx jest` | Hecho (14 suites, 58 pruebas pasando al 19-nov-2026) |
| Puertos con adaptadores intercambiables | `ExtractorCuentasPort` ↔ `ExtractorMock`; `RepositorioUsuarioPort` ↔ `RepositorioUsuarioEnMemoria` | Parcial: falta el segundo adaptador (extractor real) |
| Raíz de composición | `src/composition/container.ts` | Hecho |
| Pantallas conectadas a casos de uso | `index`, `buscar`, `resultado`, `informe`, `chat` usan `contenedor` | Hecho; `planes` y `pago` pendientes de facturación |
| Historial de ramas y Pull Requests | Sección 4 de este README | Hecho |

Documento técnico: [Arquitectura hexagonal en Confluence](https://verimind.atlassian.net/wiki/external/ZGM2ZjdjZDBkZTgzNDhmODgwNmRjMmNkOTcxZWI3ZmQ).

---

## 4. Organización del equipo y flujo Git

### 4.1 Ramas, responsables y Pull Requests

| Integrante | Rama | Qué hizo / se encarga de | Pull Request |
|---|---|---|---|
| Andrés Aucancela | `feat/ddd-shared-kernel` | Shared Kernel (`Entity`, `ValueObject`, `Result`, `DomainEvent`, `CasoDeUso`), contenedor, alias de TypeScript, regla de ESLint y Jest | #1 (integrado) |
| Petter Rodriguez | `Petter` | Documentación: README y páginas de Confluence | #2 (integrado) |
| Carlos Patiño | `feat/ddd-context-analisis` | Contexto de análisis: `Handle`, `PruebaBenford`, `NivelRiesgo`, `CuentaCreador`, puertos, casos de uso `AnalizarCuenta` y `ObtenerResultado`, adaptadores en memoria y conexión de las pantallas `buscar`, `resultado`, `informe` y `chat` | #3 (integrado) |
| Joseph Ponce | `feat/ddd-context-identity` | Contexto de identidad: `Email`, `Contrasena`, `Usuario`, `IniciarSesion`, repositorio en memoria, registro en el contenedor y conexión del login | #4 (integrado) |
| Joseph Ponce | `feat/ddd-context-facturacion` | Planes, suscripciones y pasarela simulada | En progreso |
| [COMPLETAR] | [COMPLETAR] | Servicio de extracción (scraping) y cálculo real de Benford | En progreso |
| [COMPLETAR] | [COMPLETAR] | Ajuste de la interfaz al formato 9:16 | En progreso |

### 4.2 Reglas de trabajo

- Cada integrante trabaja en su **feature branch** creada desde `main` actualizado.
- **Un commit por unidad de trabajo** (por capa o por archivo funcional), con mensajes estilo *Conventional Commits* (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`).
- Antes de abrir un Pull Request se ejecuta `npx jest`, `npx eslint src --no-cache` y `npm run typecheck`.
- Todo cambio entra a `main` mediante **Pull Request**, con título y descripción.

```bash
git checkout main && git pull origin main
git checkout -b feat/<contexto-o-tarea>
# ...commits pequeños...
git push -u origin feat/<contexto-o-tarea>
# abrir Pull Request hacia main en GitHub
```

Responsabilidades y evidencias: [Organización del desarrollo en Confluence](https://verimind.atlassian.net/wiki/external/ZjRjMzk5NzgwMWZhNDVhYzg0ODE1ZTIzN2YxNzgwNjQ).

---

## 5. Diseño en Figma y formatos de pantalla

- **Archivo de diseño:** [Moviles — VeriMind](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=0-1&t=jTQnLaIv0eh2W7GM-1) — 16 pantallas móviles (frames de 393×852).
- **Componentes:** el código organiza la interfaz en componentes reutilizables (`src/components/`), correspondientes a los átomos, moléculas y organismos del diseño.
- **Formato de presentación: 9:16.** La aplicación se presenta en relación de aspecto 9:16 (por ejemplo 360×640 o 405×720 dp). [COMPLETAR: capturas de las pantallas en 9:16 como evidencia.]
- **Otras proporciones (16:9 y 1:1):** [COMPLETAR según lo validado].

---

## 6. Estado funcional del proyecto

*(Actualizar esta tabla a medida que se integren las ramas en curso.)*

| Parte | Estado |
|---|---|
| Navegación entre las pantallas del flujo | Funciona |
| Login: validación de correo y contraseña mediante el caso de uso `IniciarSesion` | Funciona (sin autenticación real: el usuario se registra en memoria al primer acceso) |
| Búsqueda, resultado, informe y chat conectados al contexto de análisis | Funciona con datos de demostración (`ExtractorMock`) |
| Extracción real de métricas de TikTok | En progreso |
| Cálculo de la prueba de Benford desde métricas reales | En progreso (hoy usa un chi² de ejemplo) |
| Chat con IA | No implementado: respuestas de ejemplo |
| Informe en PDF | No implementado: muestra un aviso (*Toast*) |
| Planes y pago | Maqueta; migración a facturación en progreso. No se procesa ningún pago real |
| Formato 9:16 | En verificación |

### Limitaciones y consideraciones éticas

- Los resultados de Benford y Big Five son **orientativos**; no prueban fraude ni son un diagnóstico psicológico.
- Solo se contemplan **cuentas públicas**.
- La extracción automatizada de TikTok puede ir contra sus términos de uso; el uso del proyecto es **académico**.
- Los datos de demostración no corresponden a una auditoría real.
- Los usuarios y las suscripciones se guardan en memoria y se pierden al cerrar la app.

---

## 7. IA utilizadas por los integrantes del Grupo

- **Andy:** Claude Sonet 5.5 y Gemini Flash 3.8
- **Carlos:** Claude Sonet 5.5
- **Joseph:** Claude Opus 5.5
- **Petter:** Gemini Argon

Los prompts utilizados se detallan en el informe técnico: [COMPLETAR: sección o anexo].

---

## 8. Stack y versiones instaladas

- **Expo SDK:** `~58.0.25`
- **Expo Router:** `~58.0.31`
- **React / React Native:** `19.3.0` / `0.88.1`
- **TypeScript:** `~6.0.3`
- **Pruebas:** Jest (entorno Node) con `ts-jest`
- **Linter:** `eslint` (`^9.0.0`) + `eslint-config-expo` (`~58.0.4`)
- **UI e iconografía:** `lucide-react-native`, `react-native-svg`, `@expo-google-fonts/inter`
- **Áreas seguras y navegación:** `react-native-safe-area-context`, `react-native-screens`

---

## 9. Instalación y ejecución

```bash
git clone https://github.com/AndyA14/VeriMin-GRUPO4_Refactored.git
cd VeriMin-GRUPO4_Refactored
npm install --legacy-peer-deps
npx expo start
```

> Con `npm install` a secas aparece un conflicto de dependencias entre `react` y `react-dom`; por eso se usa `--legacy-peer-deps`.

Escanea el código QR con la app **Expo Go** (teléfono y PC en la misma red). Si la red lo bloquea, usa `npx expo start --tunnel`.

### Scripts

```bash
npm run start        # servidor de desarrollo de Expo
npm run android      # abre en Android / emulador
npm run ios          # abre en simulador de iOS (requiere macOS)
npm run web          # versión web
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint con configuración de Expo
npx eslint src --no-cache   # revisión completa, incluida la regla de arquitectura
npx jest             # todas las pruebas (dominio, aplicación e infraestructura)
```

---

## 10. Mapa pantalla → archivo

| Frame de Figma | Archivo | Descripción |
|---|---|---|
| Login corporativo | `src/app/index.tsx` | Valida credenciales con el caso de uso `IniciarSesion` |
| Búsqueda y extracción | `src/app/buscar.tsx` | Normaliza el `@usuario` y ejecuta `AnalizarCuenta` |
| Procesamiento 1/3, 2/3, 3/3 | `src/app/procesando.tsx` | Pantalla animada de avance por etapas |
| Resultado del análisis | `src/app/resultado.tsx` | Muestra el resultado con `ObtenerResultado` |
| Asistente | `src/app/chat.tsx` | Chat de ejemplo; usa el resultado del análisis |
| Informe para la empresa | `src/app/informe.tsx` | Resumen, Big Five y Benford; el botón PDF solo muestra un aviso |
| Apoyo al creador y recursos | `src/app/apoyo.tsx` | Selector de casos y panel (`BottomSheet`) |
| Público del creador | `src/app/publico.tsx` | Edades e intereses |
| Planes | `src/app/planes.tsx` | Selección de plan |
| Pago | `src/app/pago.tsx` | Resumen y método de pago (simulado) |
| Avisos (Toast) | `src/state/AppState.tsx` | Banner de confirmación |

**Flujo:** `Login` → `Búsqueda` → `Procesamiento` → `Resultado` → (`Chat` · `Informe` · `Público` · `Apoyo`). Desde `Búsqueda`: `Planes` → `Pago` → de vuelta a `Búsqueda` con el plan actualizado.

---

## 11. Estructura del proyecto

```text
assets/images/            Recursos gráficos
src/
  app/                    Presentación: pantallas de Expo Router
  components/             Componentes visuales reutilizables
  composition/            Raíz de composición (container.ts) que conecta puertos y adaptadores
  contexts/
    analisis/             Contexto core
      domain/             CuentaCreador, Handle, PruebaBenford, NivelRiesgo, puertos
      application/        AnalizarCuenta, ObtenerResultado
      infrastructure/     ExtractorMock, RepositorioAnalisisEnMemoria
    identity/             Contexto de identidad
      domain/             Email, Contrasena, Usuario, RepositorioUsuarioPort
      application/        IniciarSesion
      infrastructure/     RepositorioUsuarioEnMemoria
    facturacion/          Contexto de facturación (en progreso)
  shared/                 Shared Kernel
    domain/               Entity, ValueObject, Result, DomainEvent
    application/          CasoDeUso
  data/content.ts         Datos de demostración
  state/AppState.tsx      Estado de la interfaz: plan, nombre, handle y avisos
  theme/                  Colores, tipografía y espaciados
  utils/formato.ts        Utilidades de formato
eslint.config.js          ESLint, incluida la regla de dependencia hexagonal
jest.config.js            Pruebas de dominio y aplicación
```