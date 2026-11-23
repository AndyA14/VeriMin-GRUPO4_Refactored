import React, { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '../theme';

/**
 * Propiedades del componente BottomSheet.
 */
interface Props {
  /** Indica si el panel está visible en pantalla */
  visible: boolean;
  /** Función ejecutada al solicitar cerrar el panel (tap fuera o botón) */
  onClose: () => void;
  /** Elementos y vistas mostrados dentro del panel inferior */
  children: React.ReactNode;
}

/**
 * Panel modal inferior (Bottom Sheet) accesible con fondo atenuado y animación deslizante.
 *
 * Características responsive:
 * - Utiliza `useWindowDimensions` reactivo para recalcular altura y desplazamiento dinámicamente
 *   al rotar el dispositivo (portrait 9:18 a landscape 18:9) o redimensionar ventanas split-screen (1:1).
 * - En pantallas con altura reducida (ej. modo landscape 18:9 o ventanas cuadradas pequeñas),
 *   el contenido se envuelve en un `ScrollView` con altura máxima (`maxHeight: 85%`) para asegurar que
 *   los botones de acción y el contenido nunca queden cortados.
 * - En pantallas anchas (tablets, plegables 1:1 o landscape), restringe el ancho a `maxContentWidth`
 *   para mantener un diseño ergonómico y centrado.
 */
export function BottomSheet({ visible, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const [progress] = useState(() => new Animated.Value(0));

  // Si el panel se abre, se monta de inmediato sin esperar al ciclo de efectos
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      Animated.timing(progress, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim, opacity: progress }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Cerrar panel"
          accessibilityRole="button"
        />
      </Animated.View>
      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: height * 0.88,
              paddingBottom: Math.max(insets.bottom, 12) + 16,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.handle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  anchor: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    backgroundColor: colors.sheet,
    borderTopWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: layout.screenX,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 100,
    backgroundColor: colors.sheetHandle,
    marginBottom: 8,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 8,
  },
});

