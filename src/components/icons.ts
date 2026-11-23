/**
 * Mapeo y resolución de íconos vectoriales del sistema a partir de claves semánticas.
 */
import { AlertTriangle, BadgeCheck, Send, ShieldCheck } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

/** Identificadores de íconos soportados */
export type IconKey = 'badge' | 'shield' | 'alert' | 'send';

const map: Record<IconKey, LucideIcon> = {
  badge: BadgeCheck,
  shield: ShieldCheck,
  alert: AlertTriangle,
  send: Send,
};

/**
 * Retorna el componente de ícono Lucide correspondiente a la clave proporcionada.
 *
 * @param key - Clave del ícono deseado.
 * @returns Componente de ícono de react-native.
 */
export const iconFor = (key: IconKey): LucideIcon => map[key];
