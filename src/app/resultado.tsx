import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionCard } from '../components/ActionCard';
import { AlertCard } from '../components/AlertCard';
import { Card } from '../components/Card';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { Screen } from '../components/Screen';
import { StatusTag } from '../components/StatusTag';
import { contenedor } from '../composition';
import type { CuentaCreador } from '../contexts/analisis/domain/CuentaCreador';
import { colors, layout, text } from '../theme';

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <Card radiusSize={8} style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Card>
  );
}

/** VeriMind · Resultado del análisis */
export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cuenta, setCuenta] = useState<CuentaCreador | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    contenedor.analisis.obtenerResultado.ejecutar().then((resultado) => {
      if (!activo) return;
      if (resultado.esFallo) setError(resultado.error);
      else setCuenta(resultado.valor);
    });
    return () => {
      activo = false;
    };
  }, []);

  const overlay = (
    <>
      <Text style={[styles.note, { bottom: insets.bottom + 24 }]}>
        Datos y fotografías ilustrativos del prototipo. No representan una auditoría real.
      </Text>
      <Pressable
        onPress={() => router.push('/chat')}
        accessibilityRole="button"
        accessibilityLabel="Abrir chat con el asistente"
        style={({ pressed }) => [styles.fab, { bottom: insets.bottom + 16 }, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.fabIcon}>💬</Text>
      </Pressable>
    </>
  );

  if (!cuenta) {
    return (
      <Screen title="RESULTADO DEL ANÁLISIS" contentStyle={styles.content}>
        <Text style={styles.title}>{error ?? 'Cargando análisis…'}</Text>
      </Screen>
    );
  }

  return (
    <Screen title="RESULTADO DEL ANÁLISIS" overlay={overlay} contentStyle={styles.content}>
      <Text style={styles.title}>Análisis del perfil</Text>

      <View style={styles.profile}>
        <ProfilePhoto />
        <View style={styles.identity}>
          <View style={styles.nickBlock}>
            <Text style={styles.nickname}>{cuenta.handle.valor}</Text>
            <StatusTag tone="danger" label={cuenta.riesgo.etiqueta} />
          </View>
          <View style={styles.metrics}>
            <Metric value={cuenta.seguidores} label="Seguidores" />
            <Metric value={String(cuenta.publicaciones)} label="Publicaciones" />
          </View>
        </View>
      </View>

      <View style={styles.signals}>
        <AlertCard
          tone="danger"
          title="¡Anomalía detectada! Posible compra de seguidores/bots"
          detail={`Benford: χ² = ${cuenta.benford.chi2} (crítico: ${cuenta.benford.critico})`}
        />
        <AlertCard
          tone="warning"
          title={`Comentarios hostiles: ${cuenta.comentariosHostiles.cantidad} de ${cuenta.comentariosHostiles.total}`}
          detail="Posible acoso hacia el creador"
        />
      </View>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 14, gap: 23, paddingBottom: 120 },
  title: { ...text.title27, color: colors.text },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  identity: { flex: 1, gap: 12 },
  nickBlock: { gap: 6 },
  nickname: { ...text.nickname, color: colors.text },
  metrics: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, height: 80, padding: 11, gap: 5 },
  metricValue: { ...text.metric, color: colors.text },
  metricLabel: { ...text.caption10, lineHeight: 13, color: colors.textMuted },
  signals: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  note: {
    position: 'absolute',
    left: layout.screenX,
    width: 262,
    ...text.caption10,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    right: layout.screenX,
    width: 60,
    height: 60,
    borderRadius: 30,
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