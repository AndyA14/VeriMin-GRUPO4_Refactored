import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionCard } from '../components/ActionCard';
import { AlertCard } from '../components/AlertCard';
import { Card } from '../components/Card';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { Screen } from '../components/Screen';
import { StatusTag } from '../components/StatusTag';
import { account } from '../data/content';
import { colors, layout, radius, text } from '../theme';
import { useApp } from '../state/AppState';

/**
 * Fila/tarjeta de métrica individual (Seguidores, Publicaciones).
 *
 * @param props.value - Cifra numérica o textual destacada.
 * @param props.label - Etiqueta descriptiva inferior.
 */
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <Card radiusSize={radius.md} style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Card>
  );
}

/**
 * Pantalla de Resultados de Auditoría de VeriMind.
 * Muestra el resumen del perfil analizado, tarjetas de alerta de anomalías (Ley de Benford y comentarios),
 * y accesos directos a los informes de IA, audiencia y casos de apoyo.
 *
 * Adaptabilidad responsive:
 * - La barra flotante inferior (nota + botón FAB del chat) utiliza flexbox con ancho elástico
 *   para evitar solapamientos en pantallas angostas (9:18 de 360 px) y se centra hasta `maxContentWidth`
 *   en pantallas cuadradas (1:1) o apaisadas (18:9).
 */
export default function ResultScreen() {
  const router = useRouter();
  const { handle } = useApp();
  const insets = useSafeAreaInsets();

  const overlay = (
    <View style={[styles.overlayBar, { bottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <View style={styles.overlayInner} pointerEvents="box-none">
        <Text style={styles.note}>
          Datos y fotografías ilustrativos del prototipo. No representan una auditoría real.
        </Text>
        <Pressable
          onPress={() => router.push('/chat')}
          accessibilityRole="button"
          accessibilityLabel="Abrir chat con el asistente"
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.fabIcon}>💬</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen title="RESULTADO DEL ANÁLISIS" overlay={overlay} contentStyle={styles.content}>
      <Text style={styles.title}>Análisis del perfil</Text>

      <View style={styles.profile}>
        <ProfilePhoto />
        <View style={styles.identity}>
          <View style={styles.nickBlock}>
            <Text style={styles.nickname}>{handle}</Text>
            <StatusTag tone="danger" label={account.riskLabel} />
          </View>
          <View style={styles.metrics}>
            <Metric value={account.followers} label="Seguidores" />
            <Metric value={account.posts} label="Publicaciones" />
          </View>
        </View>
      </View>

      <View style={styles.signals}>
        <AlertCard
          tone="danger"
          title="¡Anomalía detectada! Posible compra de seguidores/bots"
          detail={`Benford: χ² = ${account.benford.chi2} (crítico: ${account.benford.critical})`}
        />
        <AlertCard
          tone="warning"
          title={`Comentarios hostiles: ${account.hostileComments.count} de ${account.hostileComments.total}`}
          detail="Posible acoso hacia el creador"
        />
      </View>

      <View style={styles.actionsSection}>
        <ActionCard
          title="Informe con IA"
          description="Recomendación redactada a partir de los resultados"
          onPress={() => router.push('/informe')}
        />
        <ActionCard
          title="Público del creador"
          description="Quién lo ve y qué tanto compra su audiencia"
          onPress={() => router.push('/publico')}
        />
        <ActionCard
          title="Apoyo al creador"
          description="Guía de apoyo con ejemplos de comentarios"
          onPress={() => router.push('/apoyo')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 16, gap: 26, paddingBottom: 120 },
  title: { ...text.title27, color: colors.text },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  identity: { flex: 1, gap: 12 },
  nickBlock: { gap: 6 },
  nickname: { ...text.nickname, color: colors.text },
  metrics: { flexDirection: 'row', gap: 10 },
  metric: { flex: 1, height: 84, padding: 12, gap: 6, borderRadius: radius.md },
  metricValue: { ...text.metric, color: colors.text },
  metricLabel: { ...text.caption10, lineHeight: 14, color: colors.textMuted },
  signals: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
    marginTop: 12,
    marginBottom: 14,
  },
  actionsSection: { gap: 14 },
  overlayBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenX,
  },
  overlayInner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  note: {
    flex: 1,
    ...text.caption10,
    color: colors.textMuted,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button,
    shadowColor: colors.blue,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabIcon: { fontSize: 23 },
});

