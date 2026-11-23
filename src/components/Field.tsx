import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, radius, text } from '../theme';

/**
 * Propiedades del componente Field.
 */
interface Props extends TextInputProps {
  /** Componente de ícono vectorial mostrado en el extremo izquierdo del campo */
  icon: LucideIcon;
}

/**
 * Campo de entrada de texto estilizado con ícono integrado, bordes corporativos y placeholder contrastado.
 */
export function Field({ icon: Icon, style, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Icon size={18} color={colors.textMuted} strokeWidth={1.5} absoluteStrokeWidth />
      <TextInput
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.blue}
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  input: { ...text.body13, flex: 1, color: colors.text, paddingVertical: 0 },
});
