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
import { colors, radius, text } from '../theme';

/**
 * Formatea un número como porcentaje con un decimal localizado para Ecuador/España.
 *
 * @param n - Valor numérico porcentual.
 * @returns Cadena con formato "20,6 %".
 */
const pct = (n: number) => `${n.toLocaleString('es-EC', { minimumFractionDigits: 1 })} %`;
const coma = (n: number) => String(n).replace('.', ',');

/**
 * Pantalla de Informe Corporativo Generado con IA.
 * Presenta una recomendación ejecutiva para contratación de creadores,
 * desglose de evidencia estadística (Ley de Benford, modelo Big Five y toxicidad)
 * y acción de exportación a documento PDF.
 */
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
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Informe de la cuenta</Text>
        <StatusTag tone="info" label="Redactado con IA · borrador (versión futura)" />
      </View>

      <Card tone="warning" radiusSize={radius.md} style={styles.recommendation}>
        <Text style={styles.recTitle}>PRECAUCIÓN · Contratar con verificación adicional</Text>
        <Text style={styles.recBody}>
          La cuenta analizada muestra interacciones atípicas (posible compra de seguidores o bots) y comentarios hostiles.
          Antes de firmar: pide métricas oficiales y revisa su contenido reciente.
        </Text>
      </Card>

      <View style={styles.evidenceSection}>
        <Text style={styles.sectionTitle}>Evidencia</Text>

        <Card radiusSize={radius.md} style={styles.evidenceRow}>
          <View style={styles.evidenceText}>
            <Text style={styles.evidenceTitle}>Autenticidad de la audiencia</Text>
            <Text style={styles.evidenceSub}>
              Benford: χ² = {coma(cuenta.benford.chi2)} (crítico {coma(cuenta.benford.critico)})
            </Text>
          </View>
          <StatusTag tone="danger" label="Atípico" />
        </Card>

        <Card radiusSize={radius.md} style={styles.evidenceStack}>
          <Text style={styles.evidenceTitle}>Perfil de comunicación (Big Five)</Text>
          <StackedBar segments={bigFive} height={10} radiusSize={5} />
          <Text style={styles.caption}>
            {bigFive.map((s) => `${s.label} ${pct(s.value)}`).join(' · ')}   (Total 100 %)
          </Text>
        </Card>

        <Card radiusSize={radius.md} style={styles.evidenceRow}>
          <View style={styles.evidenceText}>
            <Text style={styles.evidenceTitle}>Clima de comentarios</Text>
            <Text style={styles.evidenceSub}>
              {cuenta.comentariosHostiles.cantidad} de {cuenta.comentariosHostiles.total} con tono hostil
            </Text>
          </View>
          <StatusTag tone="warning" label="Revisar" />
        </Card>
      </View>

      <Text style={styles.caption}>Redacción asistida por IA (versión futura). Es un apoyo para decidir, no una prueba.</Text>

      <Button
        label="Descargar informe (PDF)"
        onPress={() => notify('Reporte de verificación generado (PDF)')}
        style={styles.downloadButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 20, gap: 24, paddingBottom: 80 },
  headerBlock: { gap: 8, alignItems: 'flex-start' },
  title: { ...text.title24, color: colors.text },
  recommendation: { paddingVertical: 18, paddingHorizontal: 18, gap: 12, borderRadius: radius.md },
  recTitle: { ...text.strong14, lineHeight: 20, color: colors.warningText },
  recBody: { ...text.body13, lineHeight: 20, color: colors.warningBody },
  evidenceSection: { gap: 14 },
  sectionTitle: { ...text.label13, color: colors.text, marginBottom: 4 },
  evidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18, borderRadius: radius.md },
  evidenceText: { flex: 1, gap: 4 },
  evidenceStack: { gap: 12, paddingVertical: 16, paddingHorizontal: 18, borderRadius: radius.md },
  evidenceTitle: { ...text.strong14, lineHeight: 18, color: colors.text },
  evidenceSub: { ...text.body12, lineHeight: 17, color: colors.textMuted },
  caption: { ...text.caption10, lineHeight: 16, color: colors.textMuted, marginTop: 4 },
  downloadButton: { marginTop: 8 },
});