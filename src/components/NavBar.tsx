import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, layout, text } from '../theme';

/**
 * Barra superior de navegación con botón de retroceso accesible y título de la sección activa.
 *
 * @param props.title - Título o categoría de la vista actual.
 */
export function NavBar({ title }: { title: string }) {
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/buscar');
  };

  return (
    <View style={styles.bar}>
      <Pressable
        onPress={goBack}
        hitSlop={14}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        style={styles.back}
      >
        <ArrowLeft size={18} color={colors.textMuted} strokeWidth={1.6} absoluteStrokeWidth />
      </Pressable>
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.navHeight,
    paddingHorizontal: layout.screenX,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: { width: 18, height: 18 },
  title: { ...text.eyebrow, color: colors.textMuted, flex: 1 },
});
