import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { StackedBar } from '../components/StackedBar';
import { StatusTag } from '../components/StatusTag';
import { audienceAges, audienceTopics } from '../data/content';
import { colors, radius, text } from '../theme';

/**
 * Pantalla de Análisis de Audiencia del Creador.
 * Expone la estimación demográfica por edad mediante barras apiladas,
 * intención comercial de compra en comentarios y tópicos recurrentes en las publicaciones.
 */
export default function AudienceScreen() {
  return (
    <Screen title="PÚBLICO DEL CREADOR" contentStyle={styles.content}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>¿Qué público atrae?</Text>
        <Text style={styles.subtitle}>Estimado por el lenguaje de sus comentarios. Solo cifras agregadas.</Text>
      </View>

      <Card radiusSize={radius.md} style={styles.card}>
        <Text style={styles.cardTitle}>Edad estimada de quienes comentan</Text>
        <StackedBar segments={audienceAges} height={12} radiusSize={6} />
        <View style={styles.legend}>
          {audienceAges.map((a) => (
            <View key={a.label} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: a.color }]} />
              <Text style={styles.legendText}>
                {a.label} {a.value} %
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.total}>Total: 100 %</Text>
      </Card>

      <Card tone="success" radiusSize={radius.md} style={styles.card}>
        <View style={styles.figureRow}>
          <Text style={styles.figure}>22 %</Text>
          <StatusTag tone="success" label="Interés alto" />
        </View>
        <Text style={styles.body}>de los comentarios preguntan por el precio o dónde comprar.</Text>
      </Card>

      <Card radiusSize={radius.md} style={styles.card}>
        <Text style={styles.cardTitle}>Temas que más se repiten</Text>
        <View style={styles.topics}>
          {audienceTopics.map((topic) => (
            <StatusTag key={topic} tone="info" label={topic} />
          ))}
        </View>
      </Card>

      <Card tone="warning" radiusSize={radius.md} style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.warningText }]}>Para qué te sirve</Text>
        <Text style={[styles.body, { color: colors.warningBody }]}>
          Ideal para marcas de ropa, accesorios y videojuegos. Evita alcohol y apuestas: la mitad del público estimado es
          menor de edad.
        </Text>
      </Card>

      <Text style={styles.caption}>
        Es una estimación por palabras y emojis, no la edad real. No se guardan datos de las personas que comentan.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 20, gap: 20, paddingBottom: 80 },
  headerBlock: { gap: 6, marginBottom: 4 },
  title: { ...text.title24, color: colors.text },
  subtitle: { ...text.body13, lineHeight: 18, color: colors.textMuted },
  card: { paddingVertical: 18, paddingHorizontal: 18, gap: 14, borderRadius: radius.md },
  cardTitle: { ...text.strong14, lineHeight: 19, color: colors.text, marginBottom: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...text.body12, lineHeight: 16, color: colors.textSoft },
  total: { ...text.chip, color: colors.successText, marginTop: 4 },
  figureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  figure: { ...text.display29, lineHeight: 34, color: colors.successText },
  body: { ...text.body13, lineHeight: 20, color: colors.textSoft },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  caption: { ...text.caption10, lineHeight: 16, color: colors.textMuted, marginTop: 6 },
});
