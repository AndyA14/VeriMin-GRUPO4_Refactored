import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, text } from '../theme';
import { iconFor, IconKey } from './icons';

/**
 * Propiedades del componente IconRow.
 */
interface Props {
  /** Clave del ícono vectorial a renderizar */
  icon: IconKey;
  /** Título de la fila */
  title: string;
  /** Descripción explicativa */
  description: string;
}

/**
 * Fila informativa con ícono enmarcado, título contrastado y descripción secundaria.
 */
export function IconRow({ icon, title, description }: Props) {
  const icono = React.createElement(iconFor(icon), {
    size: icon === 'shield' || icon === 'send' ? 14 : 17,
    color: colors.infoIcon,
    strokeWidth: 1.5,
    absoluteStrokeWidth: true,
  });

  return (
    <View style={styles.row} accessible accessibilityLabel={`${title}. ${description}`}>
      <View style={styles.tile}>{icono}</View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  tile: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.sm,
  },
  texts: { flex: 1, gap: 2 },
  title: { ...text.heading12, color: colors.text },
  description: { ...text.body11, color: colors.textMuted },
});
