import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { StackedBar } from '../components/StackedBar';
import { StatusTag } from '../components/StatusTag';
import { contenedor } from '../composition';
import type { CuentaCreador } from '../contexts/analisis/domain/CuentaCreador';
import { bigFive } from '../data/content';
import { useApp } from '../state/AppState';
import { colors, text } from '../theme';

const pct = (n: number) => `${n.toLocaleString('es-EC', { minimumFractionDigits: 1 })} %`;
const coma = (n: number) => String(n).replace('.', ',');

/** VeriMind · Informe para la empresa (IA) */
export default function ReportScreen() {
  const { notify } = useApp();
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

  if (!cuenta) {
    return (
      <Screen title="INFORME DEL ANÁLISIS" contentStyle={styles.content}>
        <Text style={styles.title}>{error ?? 'Cargando informe…'}</Text>
      </Screen>
    );
  }

  return (
    <Screen title="INFORME DEL ANÁLISIS" contentStyle={styles.content}>
      <Text style={styles.title}>Informe de la cuenta</Text>
      <StatusTag tone="info" label="Redactado con IA · borrador (versión futura)" />

      <Card tone="warning" style={styles.recommendation}>
        <Text style={styles.recTitle}>PRECAUCIÓN · Contratar con verificación adicional</Text>
        <Text style={styles.recBody}>
          La cuenta analizada muestra interacciones atípicas (posible compra de seguidores o bots) y comentarios hostiles.
          Antes de firmar: pide métricas oficiales y revisa su contenido reciente.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Evidencia</Text>

      <Card radiusSize={8} style={styles.evidenceRow}>
        <View style={styles.evidenceText}>
          <Text style={styles.evidenceTitle}>Autenticidad de la audiencia</Text>
          <Text style={styles.evidenceSub}>
            Benford: χ² = {coma(cuenta.benford.chi2)} (crítico {coma(cuenta.benford.critico)})
          </Text>
        </View>
        <StatusTag tone="danger" label="Atípico" />
      </Card>

      <Card radiusSize={8} style={styles.evidenceStack}>
        <Text style={styles.evidenceTitle}>Perfil de comunicación (Big Five)</Text>
        <StackedBar segments={bigFive} height={8} radiusSize={4} />
        <Text style={styles.caption}>
          {bigFive.map((s) => `${s.label} ${pct(s.value)}`).join(' · ')}   (Total 100 %)
        </Text>
      </Card>

      <Card radiusSize={8} style={styles.evidenceRow}>
        <View style={styles.evidenceText}>
          <Text style={styles.evidenceTitle}>Clima de comentarios</Text>
          <Text style={styles.evidenceSub}>
            {cuenta.comentariosHostiles.cantidad} de {cuenta.comentariosHostiles.total} con tono hostil
          </Text>
        </View>
        <StatusTag tone="warning" label="Revisar" />
      </Card>

      <Text style={styles.caption}>Redacción asistida por IA (versión futura). Es un apoyo para decidir, no una prueba.</Text>

      <Button label="Descargar informe (PDF)" onPress={() => notify('Reporte de verificación generado (PDF)')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4, gap: 14 },
  title: { ...text.title24, color: colors.text },
  recommendation: { gap: 6 },
  recTitle: { ...text.heading13, lineHeight: 17, color: colors.warningText },
  recBody: { ...text.body12, color: colors.warningBody },
  sectionTitle: { ...text.label13, color: colors.text },
  evidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  evidenceText: { flex: 1, gap: 2 },
  evidenceStack: { gap: 8, paddingVertical: 10, paddingHorizontal: 12 },
  evidenceTitle: { ...text.heading12, color: colors.text },
  evidenceSub: { ...text.body11, color: colors.textMuted },
  caption: { ...text.caption10, color: colors.textMuted },
});