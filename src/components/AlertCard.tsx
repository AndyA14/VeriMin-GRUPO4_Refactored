import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { radius, text, Tone, tones } from '../theme';

/**
 * Propiedades del componente AlertCard.
 */
interface Props {
  /** Tono de severidad de la alerta (peligro o advertencia) */
  tone: Extract<Tone, 'danger' | 'warning'>;
  /** Título o anomalía detectada */
  title: string;
  /** Detalle técnico o estadístico de la alerta */
  detail: string;
}

/**
 * Tarjeta de alerta e integridad estadística (detección de anomalías de Benford o toxicidad).
 */
export function AlertCard({ tone, title, detail }: Props) {
  const t = tones[tone];
  return (
    <View style={[styles.card, { backgroundColor: t.bg, borderColor: t.border }]} accessible accessibilityLabel={`${title}. ${detail}`}>
      <AlertTriangle size={18} color={t.text} strokeWidth={1.5} absoluteStrokeWidth />
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      <Text style={[styles.detail, { color: t.body }]}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderRadius: radius.md,
    justifyContent: 'flex-start',
  },
  title: { ...text.heading12, lineHeight: 17 },
  detail: { ...text.body11, lineHeight: 15 },
});
