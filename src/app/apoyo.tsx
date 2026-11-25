import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { IconRow } from '../components/IconRow';
import { Screen } from '../components/Screen';
import { StatusTag } from '../components/StatusTag';
import { supportCases, supportResources } from '../data/content';
import { colors, text } from '../theme';

/**
 * Pantalla de Apoyo al Creador y Clima Emocional.
 * Ofrece orientación al equipo de representación ante escenarios de acoso digital,
 * tono agresivo o malestar emocional intenso, incluyendo un panel inferior (BottomSheet)
 * con recursos y pautas de acompañamiento profesional.
 */
export default function SupportScreen() {
  const [caseId, setCaseId] = useState(supportCases[0].id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const current = supportCases.find((c) => c.id === caseId) ?? supportCases[0];

  return (
    <Screen
      title="APOYO AL CREADOR"
      contentStyle={styles.content}
      overlay={
        <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
          <Text style={styles.sheetTitle}>Recursos de apoyo</Text>
          <Text style={styles.sheetLead}>Ideas para acompañar a tu creador. No reemplazan a un profesional.</Text>
          <View style={styles.resources}>
            {supportResources.map((r) => (
              <IconRow key={r.id} icon={r.icon} title={r.title} description={r.description} />
            ))}
          </View>
          <Button label="Cerrar" onPress={() => setSheetOpen(false)} />
        </BottomSheet>
      }
    >
      <Text style={styles.title}>Apoyo al creador</Text>
      <Text style={styles.subtitle}>Vista del equipo del creador · con su autorización</Text>

      <View style={styles.cases}>
        <Text style={styles.caption}>Ejemplos del prototipo · cambia el caso</Text>
        <View style={styles.chips}>
          {supportCases.map((c) => (
            <Chip key={c.id} label={c.chip} selected={c.id === caseId} onPress={() => setCaseId(c.id)} />
          ))}
        </View>
      </View>

      <Card tone="info" style={styles.detected}>
        <StatusTag tone="info" label="Qué detectamos" />
        <Text style={styles.detectedTitle}>{current.headline}</Text>
        <Text style={styles.detectedBody}>{current.detail}</Text>
      </Card>

      <Card style={styles.help}>
        <Text style={styles.cardTitle}>La app te recomienda</Text>
        {current.tips.map((tip) => (
          <View key={tip} style={styles.tip}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.help}>
        <Text style={styles.cardTitle}>Cuándo buscar un profesional</Text>
        <Text style={styles.professional}>{current.professional}</Text>
        <Button label="Ver recursos de apoyo" onPress={() => setSheetOpen(true)} style={styles.resourcesButton} />
      </Card>

      <Text style={styles.caption}>Ejemplos del prototipo. No es un diagnóstico.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4, gap: 14 },
  title: { ...text.title24, color: colors.text },
  subtitle: { ...text.body12, color: colors.textMuted },
  cases: { gap: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  caption: { ...text.caption10, color: colors.textMuted },
  detected: { gap: 6 },
  detectedTitle: { ...text.strong14, lineHeight: 18.2, color: colors.infoText, marginTop: 6 },
  detectedBody: { ...text.body12, color: colors.infoBody },
  help: { gap: 8 },
  cardTitle: { ...text.heading13, color: colors.text },
  tip: { flexDirection: 'row', gap: 8 },
  bullet: { ...text.body12, color: colors.textMuted },
  tipText: { ...text.body12, flex: 1, color: colors.textSoft },
  professional: { ...text.body12, color: colors.textMuted },
  resourcesButton: { marginTop: 8 },
  sheetTitle: { ...text.sheetTitle, color: colors.text },
  sheetLead: { ...text.body13, color: colors.textMuted },
  resources: { gap: 8 },
});
