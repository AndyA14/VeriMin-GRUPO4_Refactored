import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '../theme';
import { NavBar } from './NavBar';

/**
 * Propiedades del contenedor Screen.
 */
interface Props {
  /** Título para la barra superior (si se omite, no se renderiza la barra) */
  title?: string;
  /** Elementos y vistas principales de la pantalla */
  children: React.ReactNode;
  /** Elemento fijo o barra de acción anclada al pie de la pantalla */
  footer?: React.ReactNode;
  /** Modales, hojas inferiores o elementos flotantes que se superponen a la pantalla */
  overlay?: React.ReactNode;
  /** Estilos adicionales para el contenedor de contenido del ScrollView */
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Contenedor principal de pantallas de VeriMind.
 * Provee:
 * - Color de fondo temático corporativo.
 * - Manejo automático de áreas seguras (notches, islas dinámicas, barras de gestos).
 * - Barra de navegación superior con retroceso automático.
 * - Desplazamiento vertical optimizado (ScrollView).
 * - Adaptabilidad responsive para 1:1, 18:9 y 9:18 mediante limitación de ancho máximo (`maxContentWidth`)
 *   y centrado en pantallas anchas (tablets, plegables y modo landscape).
 */
export function Screen({ title, children, footer, overlay, contentStyle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {title ? (
        <View style={styles.centerWrapper}>
          <NavBar title={title} />
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingHorizontal: layout.screenX,
            paddingBottom: footer ? 24 : insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.centerContent, contentStyle]}>{children}</View>
      </ScrollView>

      {footer ? (
        <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.centerWrapper}>{footer}</View>
        </View>
      ) : null}

      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  centerWrapper: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  centerContent: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  footerContainer: {
    paddingHorizontal: layout.screenX,
    paddingTop: 12,
  },
});

