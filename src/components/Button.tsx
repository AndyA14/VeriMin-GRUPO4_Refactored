import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, text } from '../theme';

/**
 * Variantes visuales para botones de acción.
 * - `primary`: Botón ancho con fondo azul institucional.
 * - `compact`: Botón de ancho reducido para barras de búsqueda inline.
 * - `outline`: Botón secundario con borde y fondo atenuado.
 */
type Variant = 'primary' | 'compact' | 'outline';

/**
 * Propiedades del componente Button.
 */
interface Props {
  /** Texto legible mostrado en el botón */
  label: string;
  /** Función disparada al pulsar el botón */
  onPress: () => void;
  /** Estilo visual del botón */
  variant?: Variant;
  /** Activa tipografía seminegrita en lugar de negrita estándar */
  semiBold?: boolean;
  /** Estilos complementarios para el contenedor del botón */
  style?: StyleProp<ViewStyle>;
  /** Pista de accesibilidad para lectores de pantalla */
  accessibilityHint?: string;
}

/**
 * Botón interactivo táctil con retroalimentación de opacidad, soporte de variantes y accesibilidad.
 */
export function Button({ label, onPress, variant = 'primary', semiBold, style, accessibilityHint }: Props) {
  const labelStyle =
    variant === 'outline' ? styles.outlineLabel : variant === 'compact' ? styles.compactLabel : semiBold ? styles.semiLabel : styles.boldLabel;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}
    >
      <Text style={labelStyle} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  primary: { height: 56, borderRadius: radius.sm, backgroundColor: colors.button, paddingHorizontal: 12 },
  compact: { height: 56, width: 112, borderRadius: radius.sm, backgroundColor: colors.button, padding: 8 },
  outline: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.blue,
    paddingHorizontal: 16,
  },
  pressed: { opacity: 0.85 },
  boldLabel: { ...text.button14, color: colors.onBlue, textAlign: 'center' },
  semiLabel: { ...text.buttonSemi14, color: colors.onBlue, textAlign: 'center' },
  compactLabel: { ...text.buttonSemi13, color: colors.onBlue, textAlign: 'center' },
  outlineLabel: { ...text.strong15, color: colors.infoText, textAlign: 'center' },
});
