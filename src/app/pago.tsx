import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LockKeyhole, ShieldCheck } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { plans } from '../data/content';
import { useApp } from '../state/AppState';
import { colors, text } from '../theme';

/** Métodos de pago admitidos en la interfaz */
type Method = 'card' | 'transfer';

/**
 * Pantalla de Confirmación y Simulación de Pago de VeriMind.
 * Permite seleccionar el método de pago (Tarjeta o Transferencia),
 * revisar el resumen de facturación mensual y activar el plan seleccionado.
 */
export default function PaymentScreen() {
  const router = useRouter();
  const { setPlan, notify } = useApp();
  const { plan: planParam } = useLocalSearchParams<{ plan?: string }>();
  const [method, setMethod] = useState<Method>('card');

  const plan = plans.find((p) => p.id === planParam) ?? plans[2];

  /** Simula la activación del plan de pago y retorna a la vista principal */
  const pay = () => {
    setPlan(plan.id);
    notify(`Plan ${plan.name} activado (ejemplo)`);
    router.dismissAll();
  };

  return (
    <Screen title="PLANES Y PAGO" contentStyle={styles.content}>
      <Text style={styles.title}>Confirmar y pagar</Text>

      <Card tone="info" style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryName}>Plan {plan.name}</Text>
          <Text style={styles.summaryPrice}>{plan.priceLabel}</Text>
        </View>
        <Text style={styles.accounts}>{plan.accounts}</Text>
        <Text style={styles.summaryNote}>
          Total hoy: {plan.priceShort}. Se cobra cada mes por adelantado y puedes cancelar cuando quieras.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Método de pago</Text>
      <View style={styles.methods}>
        <Chip label="Tarjeta" selected={method === 'card'} onPress={() => setMethod('card')} paddingHorizontal={14} />
        <Chip label="Transferencia" selected={method === 'transfer'} onPress={() => setMethod('transfer')} paddingHorizontal={14} />
      </View>

      <View style={styles.fields}>
        <Field icon={ShieldCheck} placeholder="Nombre del titular (ejemplo)" autoCapitalize="words" autoComplete="name" />
        <Field icon={LockKeyhole} placeholder="Número de tarjeta (ejemplo)" keyboardType="number-pad" autoComplete="cc-number" />
      </View>

      <Text style={styles.caption}>
        Fecha de vencimiento y código se ingresan en el proveedor de pagos certificado. VeriMind no guarda datos de tarjetas.
      </Text>

      <Button label={`Pagar ${plan.priceLabel}`} onPress={pay} />

      <Text style={styles.caption}>Pantalla de ejemplo: no se procesa ningún pago real.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, gap: 14 },
  title: { ...text.title24, color: colors.text },
  summary: { gap: 5 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  summaryName: { ...text.strong14, color: colors.text },
  summaryPrice: { ...text.strong14, color: colors.successText },
  accounts: { ...text.chip, color: colors.infoText },
  summaryNote: { ...text.body11, color: colors.textSoft },
  sectionTitle: { ...text.label13, color: colors.text },
  methods: { flexDirection: 'row', gap: 8 },
  fields: { gap: 14 },
  caption: { ...text.caption10, color: colors.textMuted },
});
