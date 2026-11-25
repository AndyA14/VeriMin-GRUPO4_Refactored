import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { radius, text, Tone, tones } from '../theme';

/**
 * Propiedades del componente StatusTag.
 */
interface Props {
  /** Tono cromático semántico de la etiqueta */
  tone: Tone;
  /** Texto mostrado dentro de la etiqueta */
  label: string;
  /** Estilos complementarios para el contenedor */
  style?: StyleProp<ViewStyle>;
}

/**
 * Etiqueta compacta de estado o advertencia con color de fondo y borde semántico.
 */
export function StatusTag({ tone, label, style }: Props) {
  const t = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: t.bg, borderColor: t.border }, style]}>
      <Text style={[styles.label, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: { ...text.chip },
});
