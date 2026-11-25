import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { radius, Tone, tones } from '../theme';

/**
 * Propiedades del componente Card.
 */
interface Props {
  /** Tono cromático semántico de la tarjeta (neutral, info, danger, warning, success) */
  tone?: Tone;
  /** Radio de curvatura de las esquinas en px (por defecto radius.md = 12) */
  radiusSize?: number;
  /** Ancho del borde en px */
  borderWidth?: number;
  /** Color personalizado del borde (si no se especifica, usa el del tono) */
  borderColor?: string;
  /** Estilos visuales complementarios */
  style?: StyleProp<ViewStyle>;
  /** Elementos hijos contenidos en la tarjeta */
  children: React.ReactNode;
}

/**
 * Contenedor visual base con esquinas redondeadas, fondo y borde con tono semántico configurable.
 */
export function Card({ tone = 'neutral', radiusSize = radius.md, borderWidth = 1, borderColor, style, children }: Props) {
  const t = tones[tone];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.bg, borderColor: borderColor ?? t.border, borderRadius: radiusSize, borderWidth },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 12, paddingHorizontal: 14 },
});
