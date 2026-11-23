import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeCheck } from 'lucide-react-native';
import type { PlanId } from '../data/content';
import { colors, layout, radius, text, tones } from '../theme';

/**
 * Estado global de la aplicación VeriMind.
 * Administra el plan activo, datos de sesión del usuario (nombre y cuenta analizada)
 * y un sistema de notificaciones temporales tipo Toast accesibles.
 */

export type CurrentPlan = 'trial' | PlanId;

/** Estructura del estado y acciones expuestas por el contexto global */
interface AppState {
  /** Plan actual seleccionado ('trial' o planes de pago) */
  plan: CurrentPlan;
  /** Actualiza el plan activo */
  setPlan: (plan: CurrentPlan) => void;
  /**
   * Muestra un aviso de confirmación accesible (Toast) en la parte superior.
   * Se oculta automáticamente tras 2.6 segundos.
   *
   * @param message - Texto explicativo del aviso a mostrar.
   */
  notify: (message: string) => void;
  /** Nombre del usuario en sesión */
  userName: string;
  /** Modifica el nombre del usuario */
  setUserName: (name: string) => void;
  /** Handle o usuario público analizado (ej: '@carlospati') */
  handle: string;
  /** Modifica el handle auditado */
  setHandle: (handle: string) => void;
}

const AppContext = createContext<AppState | null>(null);

/**
 * Hook personalizado para acceder de forma segura al contexto de VeriMind.
 * Lanza un error si se invoca fuera de un `<AppProvider>`.
 */
export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}

/**
 * Proveedor de estado global que envuelve la jerarquía de navegación.
 * Renderiza además el Toast animado para avisos globales del sistema.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<CurrentPlan>('trial');
  const [userName, setUserName] = useState('Carlos');
  const [handle, setHandle] = useState('@carlospati');
  const [message, setMessage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Dispara una notificación animada con desvanecimiento */
  const notify = useCallback(
    (next: string) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(next);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setMessage(null));
      }, 2600);
    },
    [opacity],
  );

  // Limpieza del temporizador para evitar fugas de memoria al desmontar
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const value = useMemo(
    () => ({ plan, setPlan, notify, userName, setUserName, handle, setHandle }),
    [plan, setPlan, notify, userName, setUserName, handle, setHandle],
  );
  const tone = tones.success;

  return (
    <AppContext.Provider value={value}>
      {children}
      {message ? (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={[
            styles.toast,
            { top: insets.top + 11, opacity, backgroundColor: tone.bg, borderColor: tone.border },
          ]}
        >
          <BadgeCheck size={17} color={colors.successText} strokeWidth={1.5} absoluteStrokeWidth />
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      ) : null}
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: layout.screenX,
    right: layout.screenX,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  toastText: { ...text.label13, flex: 1, color: colors.successText },
});
