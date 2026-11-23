import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { colors, radius, text } from '../theme';

/**
 * Propiedades del componente ActionCard.
 */
interface Props {
  /** Título principal de la acción */
  title: string;
  /** Resumen o descripción explicativa de la acción */
  description: string;
  /** Función ejecutada al pulsar la tarjeta */
  onPress: () => void;
}

/**
 * Tarjeta interactiva de acción destacada con ícono de verificación y chevron de navegación.
 */
export function ActionCard({ title, description, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.tile}>
        <BadgeCheck size={19} color={colors.infoIcon} strokeWidth={1.5} absoluteStrokeWidth />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.md,
  },
  pressed: { opacity: 0.85 },
  tile: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.iconTile,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.md,
  },
  texts: { flex: 1, gap: 3 },
  title: { ...text.strong14, color: colors.infoText },
  description: { ...text.body12, color: colors.textMuted },
  chevron: { ...text.strong15, fontSize: 18, color: colors.infoIcon },
});
