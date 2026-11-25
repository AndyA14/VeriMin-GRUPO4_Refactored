import type { TextStyle } from 'react-native';

/**
 * Sistema de diseño y tokens visuales de VeriMind.
 * Extraídos y normalizados a partir del archivo de Figma "Moviles" (VeriMind · Colores y Tipografía).
 */
export const colors = {
  /** Fondo general de la aplicación */
  bg: '#070A12',
  /** Superficie estándar para tarjetas y contenedores */
  surface: '#101725',
  /** Superficie con elevación visual para barras flotantes o campos */
  surfaceElevated: '#1E293B',
  /** Borde predeterminado para tarjetas e inputs */
  border: '#253044',
  /** Texto principal de alto contraste */
  text: '#F5F7FC',
  /** Texto secundario o atenuado */
  textMuted: '#9AA8BE',
  /** Texto con contraste suave para descripciones */
  textSoft: '#C4CFE0',
  /** Color para placeholders en campos de entrada */
  placeholder: '#94A3B8',

  /** Fondo de los botones principales. Sugerido #2563EB para mejor contraste con texto blanco */
  button: '#3B82F6',
  blue: '#3B82F6',
  blueStrong: '#2563EB',
  onBlue: '#FFFFFF',

  // Colores semánticos para información y acentos celestes
  infoIcon: '#60A5FA',
  infoText: '#A8CEFF',
  infoBody: '#C4D9F5',
  infoBg: '#0D2344',
  infoBorder: '#28528A',
  iconTile: '#102A52',

  // Colores semánticos para estados de peligro y riesgo crítico
  dangerText: '#FF8C97',
  dangerBg: '#34151F',
  dangerBorder: '#7D3043',

  // Colores semánticos para advertencias y atención
  warningText: '#FBBF24',
  warningBg: '#332507',
  warningBorder: '#7A5A12',
  warningBody: '#E5D9B8',

  // Colores semánticos para éxito y confirmación
  successText: '#80E7BE',
  successBg: '#0D3029',
  successBorder: '#24624E',

  // Elementos específicos de componentes
  chatPanel: '#0B111D',
  userBubble: '#172A47',
  userBubbleBorder: '#2A466D',
  sheet: '#0F1623',
  sheetHandle: '#2A3446',
  scrim: 'rgba(0,0,0,0.55)',
  glass: 'rgba(20,30,44,0.6)',
  glassBorder: 'rgba(113,137,181,0.2)',
  skeleton: 'rgba(92,112,139,0.4)',
  spinnerLight: '#B9DEFF',

  // Paleta de series para gráficos y métricas (Big Five y Audiencia)
  series: {
    violet: '#8B5CF6',
    cyan: '#22D3EE',
    green: '#34D399',
    amber: '#FBBF24',
    rose: '#FB7185',
  },
} as const;

/** Familia de fuentes tipográficas basadas en Inter (Google Fonts) */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

/** Radios de curvatura en bordes para contenedores, tarjetas y píldoras */
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 100 } as const;

/** Medidas de disposición espacial predeterminadas */
export const layout = {
  /** Margen horizontal estándar en pantallas móviles */
  screenX: 24,
  /** Altura estándar de la barra de navegación superior */
  navHeight: 48,
  /** Ancho máximo de contenido para optimizar lectura en pantallas anchas (tablets, 1:1, landscape) */
  maxContentWidth: 560,
} as const;

const t = <T extends TextStyle>(style: T) => style;

/**
 * Escala tipográfica estructurada con tamaño de fuente, altura de línea y espaciado de letras.
 */
export const text = {
  display30: t({ fontFamily: fonts.semiBold, fontSize: 30, lineHeight: 33.6, letterSpacing: -0.33 }),
  display29: t({ fontFamily: fonts.semiBold, fontSize: 29, lineHeight: 33.4, letterSpacing: -0.29 }),
  greeting: t({ fontFamily: fonts.semiBold, fontSize: 29, lineHeight: 35 }),
  title27: t({ fontFamily: fonts.semiBold, fontSize: 27, lineHeight: 30.2, letterSpacing: -0.24 }),
  title24: t({ fontFamily: fonts.semiBold, fontSize: 24, lineHeight: 26.9 }),
  sheetTitle: t({ fontFamily: fonts.semiBold, fontSize: 18, lineHeight: 22 }),
  nickname: t({ fontFamily: fonts.bold, fontSize: 19, lineHeight: 23 }),
  metric: t({ fontFamily: fonts.semiBold, fontSize: 21, lineHeight: 25, letterSpacing: -0.15 }),
  lead16: t({ fontFamily: fonts.regular, fontSize: 16, lineHeight: 19 }),
  assistantTitle: t({ fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22 }),
  body15: t({ fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 }),
  strong15: t({ fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 18 }),
  body14: t({ fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }),
  medium14: t({ fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 }),
  strong14: t({ fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 18.2 }),
  button14: t({ fontFamily: fonts.bold, fontSize: 14, lineHeight: 17 }),
  buttonSemi14: t({ fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 17 }),
  buttonSemi13: t({ fontFamily: fonts.semiBold, fontSize: 13, lineHeight: 17 }),
  body13: t({ fontFamily: fonts.regular, fontSize: 13, lineHeight: 18.2 }),
  label13: t({ fontFamily: fonts.medium, fontSize: 13, lineHeight: 16 }),
  heading13: t({ fontFamily: fonts.semiBold, fontSize: 13, lineHeight: 16 }),
  heading12: t({ fontFamily: fonts.semiBold, fontSize: 12, lineHeight: 15 }),
  body12: t({ fontFamily: fonts.regular, fontSize: 12, lineHeight: 16.8 }),
  chip: t({ fontFamily: fonts.medium, fontSize: 11, lineHeight: 13 }),
  body11: t({ fontFamily: fonts.regular, fontSize: 11, lineHeight: 15.4 }),
  sender: t({ fontFamily: fonts.semiBold, fontSize: 11, lineHeight: 14, letterSpacing: 0.04 }),
  eyebrow: t({ fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.2 }),
  caption10: t({ fontFamily: fonts.regular, fontSize: 10, lineHeight: 14 }),
} as const;

/** Tonos semánticos disponibles para tarjetas, etiquetas y alertas */
export type Tone = 'neutral' | 'info' | 'danger' | 'warning' | 'success';

/** Mapeo de combinaciones de color (fondo, borde, título, cuerpo) para cada tono */
export const tones: Record<Tone, { bg: string; border: string; text: string; body: string }> = {
  neutral: { bg: colors.surface, border: colors.border, text: colors.text, body: colors.textMuted },
  info: { bg: colors.infoBg, border: colors.infoBorder, text: colors.infoText, body: colors.infoBody },
  danger: { bg: colors.dangerBg, border: colors.dangerBorder, text: colors.dangerText, body: colors.textSoft },
  warning: { bg: colors.warningBg, border: colors.warningBorder, text: colors.warningText, body: colors.warningBody },
  success: { bg: colors.successBg, border: colors.successBorder, text: colors.successText, body: colors.textSoft },
};
