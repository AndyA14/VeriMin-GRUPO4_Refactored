# VeriMind Analytics — Expo (React Native)

**Integrantes del Grupo:** Andrés Aucancela, Carlos Patiño, Joseph Ponce y Petter Rodriguez

Implementación de **16 pantallas/diseños móviles del prototipo** del archivo de Figma «Moviles» (`Wyt8RCSYYWKs4xzLd5ptPF`), frames de 393×852.

---

## Problema, propósito y fuente de información

**Problema del negocio.** Las marcas que consideran colaborar con creadores de contenido necesitan interpretar múltiples señales sobre las cuentas y sus audiencias. La información fragmentada puede dificultar una evaluación consistente y transparente antes de una colaboración.

**Propósito.** VeriMind Analytics propone organizar indicadores de perfiles públicos de creadores (principalmente TikTok) para apoyar la revisión de sus características, audiencia y clima de comentarios. El prototipo presenta resultados orientativos; **no confirma fraude, diagnostica personalidad ni determina por sí solo la idoneidad para una campaña**.

**Fuente actual.** La información mostrada por las pantallas procede de datos de demostración definidos en `src/data/content.ts`. No se encontró un extractor de TikTok real en la versión del repositorio adjunta. La obtención real de datos, su autorización y la validación metodológica se consideran trabajos futuros.

## Domain-Driven Design (DDD)

Se aplica **DDD como enfoque de modelado y separación de responsabilidades**. En el diseño estratégico se identifica como candidato a *Core Domain* la evaluación de perfiles de creadores. Los límites del modelo y sus reglas se documentan con el lenguaje ubicuo y los Bounded Contexts. En el diseño táctico se proponen entidades, agregados, objetos de valor y casos de uso; las propuestas **no deben confundirse con implementaciones ya integradas**.

### Lenguaje ubicuo — resumen

| Término | Significado compartido |
|---|---|
| Marca | Organización que evalúa creadores para posibles colaboraciones. |
| Creador | Persona cuyo perfil público puede ser analizado. |
| Cuenta de creador | Perfil de una plataforma social identificado por un handle. |
| Handle | Identificador de la cuenta que se valida o normaliza. |
| Análisis | Ejecución que procesa datos para obtener indicadores de una cuenta. |
| Resultado del análisis | Conjunto de indicadores y observaciones de una ejecución. |
| Anomalía | Desviación respecto de un criterio definido; **no equivale a fraude**. |
| Prueba de Benford | Comparación estadística exploratoria cuya aplicabilidad requiere justificación. |
| Perfil de comunicación / Big Five | Representación orientativa de cinco dimensiones; no diagnóstico psicológico. |
| Clima de comentarios | Señales sobre tono y contenido; la crítica negativa no equivale necesariamente a acoso. |
| Plan / Suscripción | Oferta de acceso y relación del usuario con sus condiciones comerciales. |
| Nivel de riesgo | Categoría propuesta que requiere reglas, umbrales y validación. |

**Definiciones completas, ejemplos y términos por validar:** [Lenguaje ubicuo en Confluence](https://verimind.atlassian.net/wiki/external/YmJkNDI4NjQ3NDhhNDgyMDhjMWVjODVmNWZhMmM3N2I).

### Diseño estratégico — Bounded Contexts propuestos

| Contexto | Clasificación inicial | Responsabilidad |
|---|---|---|
| Evaluación de Influencers | Core | Coordinar el análisis y producir indicadores. |
| Adquisición y Normalización de Datos Públicos | Supporting | Obtener/normalizar datos y aislar formatos externos. |
| Informes y Asistencia a la Decisión | Supporting, por validar | Presentar resultados para su interpretación. |
| Apoyo al Creador | Supporting, por validar | Agrupar funcionalidades de apoyo, si se aprueba ese alcance. |
| Identidad y Acceso | Generic | Gestionar usuarios y autenticación. |
| Suscripciones y Facturación | Generic, por validar | Administrar planes, suscripciones y pagos. |
| Notificaciones | Generic, por validar | Comunicar eventos relevantes, si requiere contexto propio. |

En el **ZIP revisado** se observan directorios de implementación previstos para `analisis`, `identity` y `facturacion`. Los demás contextos listados son parte del **modelo de diseño** y requieren validación; no se encontraron como carpetas implementadas.

**Context Map, responsabilidades y relaciones:** [Diseño estratégico DDD en Confluence](https://verimind.atlassian.net/wiki/external/YzRjMmE4NDNhOGM5NDJkN2JjMDlhMjRjZDRkYmM0M2M).

### Diseño táctico — conceptos y casos de uso

Los candidatos documentados incluyen `CuentaCreador`, `Handle`, `PruebaBenford`, `NivelRiesgo` y `ResultadoAnalisis` en evaluación; `Usuario`, `Email`, `Contrasena`, `IniciarSesion` y `CerrarSesion` en identidad; y `Plan`, `Suscripcion` y `ActivarPlan` en facturación. Los contratos, invariantes, errores y diagramas están ampliados en Confluence.

**Estado comprobado del ZIP:** `src/contexts/analisis`, `src/contexts/identity` y `src/contexts/facturacion` contienen subdirectorios `domain`, `application` e `infrastructure` con archivos `.gitkeep`, sin clases del dominio implementadas en esta copia. Las ramas en curso pueden contener cambios posteriores no reflejados aquí.

**Modelo táctico detallado:** [Diseño táctico DDD en Confluence](https://verimind.atlassian.net/wiki/external/N2ZjOTc4ZDk3ODgwNGZmYzgwMTlmNzAzYTcxMWMxMmY).

## Arquitectura hexagonal — objetivo y avance real

La arquitectura objetivo separa:

- **Dominio:** entidades, objetos de valor, invariantes y eventos sin dependencias de interfaz.
- **Aplicación:** casos de uso y contratos (puertos).
- **Infraestructura:** adaptadores concretos para persistencia, proveedores y simulaciones.
- **Presentación:** pantallas Expo Router / React Native y componentes reutilizables.
- **Composición:** ensamblaje de las dependencias.

**Avances verificados en el ZIP:** `src/shared/domain/` contiene `Entity.ts`, `ValueObject.ts`, `Result.ts` y `DomainEvent.ts`; `src/shared/application/CasoDeUso.ts` define una abstracción compartida; `src/composition/` contiene la raíz de composición inicial; se incluyen configuración de Jest (`jest.config.js`), una prueba del Shared Kernel y restricciones de importación para dominio en `eslint.config.js`. Esto demuestra **infraestructura arquitectónica inicial**, no el funcionamiento integral de los tres contextos.

**Documento técnico:** [Arquitectura hexagonal en Confluence](https://verimind.atlassian.net/wiki/external/ZGM2ZjdjZDBkZTgzNDhmODgwNmRjMmNkOTcxZWI3ZmQ).

## Organización del equipo y flujo Git

Las responsabilidades acordadas y las ramas de trabajo son:

| Integrante | Rama | Responsabilidad |
|---|---|---|
| Andrés Aucancela | `feat/ddd-shared-kernel` | Primitivas compartidas, composición, alias, ESLint, Jest y apoyo en integración. |
| Carlos Patiño | `feat/ddd-context-analisis` | Contexto de análisis, objetos del dominio, casos de uso y adaptador de datos simulado. |
| Joseph Ponce | `feat/ddd-context-identity` | Identidad, credenciales, casos de uso y repositorio en memoria. |
| Joseph Ponce | Facturación: rama por confirmar | Planes, suscripciones y pasarela de pago simulada. |
| Petter Rodriguez | Documentación | README, informe técnico y páginas de Confluence. |

**Integración prevista:** feature branches desde `refactor/ddd-architecture`, commits por unidad de trabajo, Pull Requests hacia la rama de arquitectura y posterior integración a `main`. La actividad Git actual debe verificarse en el servidor; los archivos ZIP **no incluyen el historial de ramas, commits ni PRs**.

**Responsabilidades, evidencias y flujo:** [Organización del desarrollo en Confluence](https://verimind.atlassian.net/wiki/external/ZjRjMzk5NzgwMWZhNDVhYzg0ODE1ZTIzN2YxNzgwNjQ).

## Criterios de presentación y pendientes de verificación

| Criterio | Estado en la copia y revisión del equipo |
|---|---|
| Planteamiento y origen de datos | Documentado; los datos actuales son simulados (`content.ts`). |
| Pantallas y navegación React Native | Prototipo disponible en `src/app/`. |
| DDD y lenguaje ubicuo | Diseñados y enlazados; implementación de contextos pendiente en esta copia. |
| Shared Kernel, lint arquitectónico y Jest | Configuración y archivos presentes en el ZIP; no se ejecutaron las pruebas en esta revisión documental. |
| Feature branches y PRs | Planificados; necesitan evidencia actualizada del repositorio remoto. |
| Atomic Design en Figma | Organización y completitud pendientes de verificación directa. |
| Relaciones 9:16, 16:9 y 1:1 | Pendiente de evidencia de adaptabilidad; Figma se describe con frames originales de 393 × 852. |
| Extracción real, motor de IA, pagos y PDF | Actualmente simulados o no implementados en la versión inspeccionada. |

**Nota metodológica:** los datos estadísticos mostrados deben interpretarse como parte del prototipo; una desviación de Benford no demuestra automáticamente bots o fraude. La visualización de Big Five tampoco constituye un diagnóstico psicológico.

---

## IA utilizadas por los integrantes del Grupo

- **Andy:** Claude Sonet 5.5 y Gemini Flash 3.8
- **Carlos:** Claude Sonet 5.5
- **Joseph:** Claude Opus 5.5
- **Petter:** Gemini Argon

---

## Diseño en Figma

Enlace al archivo y prototipo de Figma utilizado para el diseño y construcción de las 16 pantallas de la aplicación:

- **Diseño en Figma:** [Moviles — VeriMind](https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=0-1&t=jTQnLaIv0eh2W7GM-1)
- **Enlace directo:** `https://www.figma.com/design/Wyt8RCSYYWKs4xzLd5ptPF/Moviles?node-id=0-1&t=jTQnLaIv0eh2W7GM-1`

---

## Estado del Proyecto y Arquitectura

La aplicación es un prototipo interactivo funcional desarrollado con **Expo Router** y **React Native**. Integra un flujo completo de auditoría para cuentas de redes sociales (TikTok), desde un formulario de acceso con validación local hasta búsqueda de perfiles, simulación de procesamiento y visualización de indicadores (Benford, Big Five y comentarios), informes en pantalla, recursos de apoyo, chat simulado y selección de planes con pago simulado. Los datos de análisis provienen de `src/data/content.ts`.

### Características Principales Implementadas

- **Validación de formulario (sin autenticación real):** Validación reactiva de correo corporativo mediante expresión regular (`correoValido`) y contraseña mínima de 6 caracteres; derivación automática del nombre de usuario (`nombreDesdeCorreo`) para personalizar la experiencia.
- **Flujo Dinámico de Usuario:** El handle ingresado en la búsqueda (`@usuario`) se normaliza y propaga globalmente a través del estado (`AppState`), reflejándose en las pantallas de Resultado y Chat.
- **Procesamiento Animado:** Pantalla de análisis por etapas con barra de progreso animada continua (`Animated`), spinner personalizado e inspección visual simulada de publicaciones.
- **Asistente Interactivo Simulado:** Chat local con envío de mensajes, scroll automático, nombre del usuario y respuestas predefinidas de `chatSeed`, sin conexión a un modelo de IA.
- **Informes y Métricas Simulados:** Visualización de proporciones Big Five y rangos de edad mediante gráficos de barras apiladas (`StackedBar`), métricas de riesgo y anomalías de Benford.
- **Módulo de Apoyo al Creador:** Selector reactivo de casos de riesgo (acoso, tensión) y panel deslizable (`BottomSheet`) con recursos y canales de ayuda.
- **Planes y Suscripción Simulados:** Selección de planes (Free, Starter, Professional, Enterprise), pasarela simulada con métodos de pago (tarjeta/transferencia) y sistema de notificaciones flotantes (*Toast*).
- **Control de Calidad:** Configuración estricta de TypeScript (`tsc --noEmit`) y ESLint con configuración plana para Expo (`eslint-config-expo`).

---

## Stack y versiones instaladas

- **Expo SDK:** `~58.0.25`
- **Expo Router:** `~58.0.31`
- **React / React Native:** `19.3.0` / `0.88.1`
- **TypeScript:** `~6.0.3`
- **Linter:** `eslint` (`^9.0.0`) + `eslint-config-expo` (`~58.0.4`)
- **UI e Iconografía:** `lucide-react-native`, `react-native-svg`, `@expo-google-fonts/inter`
- **Áreas Seguras y Navegación:** `react-native-safe-area-context`, `react-native-screens`

---

## 1. Instalación en un entorno nuevo

El proyecto cuenta con su estructura base y dependencias declaradas en `package.json`. Para instalar las dependencias en una instalación limpia o nuevo clon:

```bash
npm install
```

*(Nota: si ocurre algún conflicto de peer dependencies entre versiones de paquetes de React, ejecuta `npm install --legacy-peer-deps` o `npx expo install --fix`).*

---

## 2. Configuración de Expo Router

- En `package.json`: `"main": "expo-router/entry"`.
- En `app.json`, dentro de `"expo"`:
  - `"scheme": "verimind"`
  - `"userInterfaceStyle": "dark"`
  - `"plugins": ["expo-router"]`
- Enrutamiento basado en archivos ubicado bajo el directorio `src/app/` con soporte para transiciones y layout raíz (`src/app/_layout.tsx`).

---

## 3. Scripts de Desarrollo y Calidad

Disponibles en `package.json`:

```bash
# Iniciar el servidor de desarrollo de Expo
npm run start       # o npx expo start

# Ejecución en plataformas específicas
npm run android     # Inicia en Android / emulador
npm run ios         # Inicia en simulador de iOS (requiere macOS)
npm run web         # Inicia versión web

# Verificación de tipos y linting
npm run typecheck   # Ejecuta validación estricta de TypeScript (tsc --noEmit)
npm run lint        # Valida estilo de código con ESLint
```

---

## 4. Recursos Gráficos (`assets/images/`)

Las imágenes del proyecto se encuentran organizadas en `assets/images/`:

| Archivo            | Uso en la aplicación                                                     |
|--------------------|--------------------------------------------------------------------------|
| `login-hero.png`   | Imagen de cabecera editorial en la pantalla de inicio de sesión          |
| `profile.png`      | Fotografía del perfil del creador analizado                              |
| `post-1/2/3.png`   | Miniaturas ilustrativas de publicaciones en la pantalla de procesamiento |

El desenfoque (`blurRadius={1.5}`) y la opacidad (`70 %`) de las miniaturas en la carga son aplicados directamente por el código.

---

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
  data/
    content.ts          Datos base del prototipo (Big Five, planes, casos de apoyo, etc.)
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

## 7. Decisiones de implementación y estado del código

- **Validación de Formularios:** Se incorporó validación formal en el inicio de sesión (`correoValido`), exigiendo un formato corporativo legítimo y contraseña de al menos 6 caracteres antes de permitir la entrada, con retroalimentación visual de errores mediante mensajes reactivos.
- **Persistencia en Memoria del Flujo:** El handle de TikTok introducido en el buscador se limpia y normaliza (`normalizarUsuario`), transmitiéndose al estado global (`AppState`) para personalizar la pantalla de resultados y el chat. De igual forma, el correo del login define el nombre del auditor (`nombreDesdeCorreo`) visible en los saludos de bienvenida y en la autoría de los mensajes del chat.
- **Simulación del Asistente (sin IA conectada):** El chat permite enviar mensajes en tiempo real, añade las intervenciones a una lista local, efectúa desplazamiento automático y responde de forma asistida (con retraso realista de 600 ms) sin requerir servicios externos de terceros ni claves de API.
- **Reporte PDF (simulado):** Al pulsar el botón de descarga se presenta una notificación flotante (*Toast*); el código revisado no crea ni descarga un archivo PDF.
- **Animaciones e Interacciones:** La etapa de procesamiento emplea animación fluida a través de la API `Animated` de React Native para el llenado de la barra según los pasos estipulados en el diseño.
- **Pasarela de Pagos (simulada):** La pantalla de pagos permite alternar entre tarjeta y transferencia bancaria, reflejando el cambio de estado tanto en el chip de la pantalla de búsqueda como en el contexto global de la aplicación.
