/**
 * Contenido de ejemplo de la app (datos ilustrativos del prototipo, no una auditoría real).
 * Provee estructuras tipadas para métricas estadísticas, fases de análisis,
 * modelo Big Five, casos de apoyo y configuración comercial de planes.
 */

/** Métricas simuladas para la cuenta pública auditada */
export const account = {
  handle: '@carlospati',
  followers: '24.8K',
  posts: '10',
  riskLabel: 'Riesgo elevado · 78 %',
  /** Resultados de la prueba estadística de Benford (detección de números anómalos/bots) */
  benford: { chi2: '24.51', critical: '20.09' },
  /** Frecuencia de comentarios tóxicos detectados en la muestra */
  hostileComments: { count: 3, total: 10 },
};

/** Lista de dimensiones auditadas en el perfil */
export const analysisItems = [
  { id: 'audience', icon: 'badge', title: 'Autenticidad de la audiencia', description: 'Ley de Benford y proporciones de interacción' },
  { id: 'comm', icon: 'shield', title: 'Perfil de comunicación', description: 'Big Five con porcentajes que suman 100 %' },
  { id: 'climate', icon: 'alert', title: 'Clima de comentarios', description: 'Señales de acoso o tono hostil' },
] as const;

/** Etapas consecutivas del proceso de escaneo y auditoría en segundo plano */
export const processingStages = [
  { message: 'Extrayendo activos digitales y publicaciones de la cuenta pública...', progress: 113 / 309 },
  { message: 'Verificando autenticidad de la audiencia (Ley de Benford)…', progress: 200 / 309 },
  { message: 'Analizando comentarios y perfil de comunicación…', progress: 290 / 309 },
] as const;

/** Dimensiones de personalidad lingüística basadas en el modelo Big Five */
export const bigFive = [
  { label: 'Apertura', value: 20.6, color: '#8B5CF6' },
  { label: 'Responsabilidad', value: 21.6, color: '#22D3EE' },
  { label: 'Extraversión', value: 21.7, color: '#34D399' },
  { label: 'Amabilidad', value: 21.5, color: '#FBBF24' },
  { label: 'Neuroticismo', value: 14.6, color: '#FB7185' },
] as const;

/** Distribución demográfica estimada de la audiencia */
export const audienceAges = [
  { label: 'Niños', value: 10, color: '#FB7185' },
  { label: 'Adolescentes', value: 40, color: '#FBBF24' },
  { label: 'Jóvenes', value: 35, color: '#22D3EE' },
  { label: 'Adultos', value: 15, color: '#8B5CF6' },
] as const;

/** Temáticas más frecuentes en el contenido del creador */
export const audienceTopics = ['Moda', 'Humor', 'Videojuegos'] as const;

/** Estructura de caso de apoyo psicológico/emocional para creadores de contenido */
export interface SupportCase {
  id: string;
  chip: string;
  headline: string;
  detail: string;
  tips: [string, string, string];
  professional: string;
}

/** Casos de apoyo preconfigurados con recomendaciones y sugerencias */
export const supportCases: SupportCase[] = [
  {
    id: 'harassment',
    chip: 'Acoso recibido',
    headline: 'Tu creador recibe comentarios hostiles',
    detail: '3 de 10 comentarios recientes tienen tono hostil. Es un indicio, no una prueba.',
    tips: [
      'Activa el filtro de comentarios y reporta las cuentas que insultan.',
      'Pregúntale cómo se siente antes de responder en público.',
      'Acuerden juntos qué comentarios responder y cuáles ignorar.',
    ],
    professional: 'Si el acoso no para o le afecta mucho, consulta con un psicólogo.',
  },
  {
    id: 'aggressive',
    chip: 'Tono agresivo',
    headline: 'El tono de sus videos es más hostil que de costumbre',
    detail: 'Sus últimos textos tienen más palabras agresivas. Puede ser un mal momento.',
    tips: [
      'Hablen antes de publicar: una pausa ayuda.',
      'Revisen juntos el texto del video si se puede.',
      'Propón una guía de tono para responder en redes.',
    ],
    professional: 'Si el enojo se repite, un psicólogo puede ayudarle a manejarlo.',
  },
  {
    id: 'distress',
    chip: 'Malestar intenso',
    headline: 'Alerta: tu creador podría necesitar apoyo psicológico',
    detail:
      'Sus publicaciones muestran mucho cansancio y tristeza, y algunas frases podrían indicar ganas de hacerse daño. Es un indicio, no un diagnóstico.',
    tips: [
      'Habla con calma y sin juzgar; escucha primero.',
      'No minimices lo que siente ni lo presiones a publicar.',
      'Ofrécele buscar ayuda profesional juntos.',
    ],
    professional: 'Si ves peligro inmediato, no lo dejes solo y busca ayuda ya.',
  },
];

export const supportResources = [
  { id: 'talk', icon: 'shield', title: 'Cómo hablar con tu creador', description: 'Guía corta para conversar con calma' },
  { id: 'moderate', icon: 'alert', title: 'Moderar y reportar comentarios', description: 'Pasos dentro de la plataforma' },
  { id: 'pro', icon: 'send', title: 'Buscar un profesional', description: 'Un psicólogo o psicóloga de confianza' },
] as const;

export type PlanId = 'free' | 'essential' | 'professional' | 'agency';

export interface Plan {
  id: PlanId;
  name: string;
  priceLabel: string;
  /** Texto para el botón de pago */
  priceShort: string;
  accounts: string;
  description: string;
  badge?: { label: string; tone: 'success' | 'info' };
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    priceLabel: 'USD 0',
    priceShort: 'USD 0',
    accounts: 'Hasta 5 cuentas',
    description: 'Verificación de audiencia (Benford) y reporte básico.',
    badge: { label: 'Para empezar', tone: 'success' },
  },
  {
    id: 'essential',
    name: 'Esencial',
    priceLabel: 'USD 29,99 / mes',
    priceShort: 'USD 29,99',
    accounts: 'Hasta 15 cuentas',
    description: 'Todo lo anterior + Big Five, clima de comentarios y PDF.',
  },
  {
    id: 'professional',
    name: 'Profesional',
    priceLabel: 'USD 59,99 / mes',
    priceShort: 'USD 59,99',
    accounts: 'Hasta 50 cuentas',
    description: 'Todo lo anterior + público del creador e informe con IA.',
    badge: { label: 'Recomendado', tone: 'info' },
  },
  {
    id: 'agency',
    name: 'Agencia',
    priceLabel: 'USD 119,99 / mes',
    priceShort: 'USD 119,99',
    accounts: 'Hasta 150 cuentas',
    description: 'Todo lo anterior + apoyo al creador, marca blanca y API.',
  },
];

export const chatSeed = {
  greeting: 'Asistente VeriMind: Hola. ¿Qué deseas consultar sobre el perfil?',
  userName: 'Carlos',
  userQuestion: '¿Qué anomalías se detectaron y qué hago con los comentarios hostiles?',
  assistantAnswer:
    'Patrón atípico en las interacciones (Benford: χ² = 24.51 > 20.09): indicio de posible compra de seguidores o bots, no una prueba. Además, 3 de 10 comentarios son hostiles.',
  cannedReply:
    'Esta es una respuesta de ejemplo. En la versión final, el asistente responderá con base en los resultados del análisis.',
};
