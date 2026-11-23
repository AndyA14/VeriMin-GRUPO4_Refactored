import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { StatusTag } from '../components/StatusTag';
import { PlanId, plans } from '../data/content';
import { useApp } from '../state/AppState';
import { colors, text } from '../theme';

/**
 * Pantalla de Selección de Planes Comerciales de VeriMind.
 * Permite seleccionar entre los planes Gratis, Esencial, Profesional y Agencia,
 * actualizando el estado de suscripción del usuario o redirigiendo a la pasarela de pago.
 */
export default function PlansScreen() {
  const router = useRouter();
  const { setPlan, notify } = useApp();
  const [selectedId, setSelectedId] = useState<PlanId>('professional');
  const selected = plans.find((p) => p.id === selectedId) ?? plans[2];

  /** Aplica el plan gratuito directamente o avanza a la pantalla de pago para planes premium */
  const confirm = () => {
    if (selected.id === 'free') {
      setPlan('free');
      notify('Plan Gratis activado (ejemplo)');
      router.replace('/buscar');
    } else {
      router.push({ pathname: '/pago', params: { plan: selected.id } });
    }
  };

  return (
    <Screen title="PLANES Y PAGO" contentStyle={styles.content}>
      <Text style={styles.title}>Elige tu plan</Text>
      <Text style={styles.subtitle}>
        Elige según cuántas cuentas manejas. Puedes empezar gratis y probar todo durante 7 días.
      </Text>

      <View style={styles.list}>
        {plans.map((plan) => {
          const active = plan.id === selectedId;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedId(plan.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${plan.name}, ${plan.priceLabel}. ${plan.accounts}. ${plan.description}`}
            >
              <Card
                tone={active ? 'info' : 'neutral'}
                borderColor={active ? colors.blueStrong : undefined}
                borderWidth={active ? 1.5 : 1}
                style={styles.plan}
              >
                 <View style={styles.planHeader}>
                  <View style={styles.planTitle}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.badge ? <StatusTag tone={plan.badge.tone} label={plan.badge.label} /> : null}
                  </View>
                  <Text style={styles.price}>{plan.priceLabel}</Text>
                </View>
                <Text style={styles.accounts}>{plan.accounts}</Text>
                <Text style={styles.description}>{plan.description}</Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Button label={`Continuar con ${selected.name}`} onPress={confirm} />

      <Text style={styles.caption}>
        Informe puntual: USD 9,99 por cuenta. Planes y precios de ejemplo; por validar con clientes.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, gap: 10 },
  title: { ...text.title24, color: colors.text },
  subtitle: { ...text.body12, color: colors.textMuted },
  list: { gap: 10, marginBottom: 10 },
  plan: { gap: 4, paddingVertical: 10 },
  planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 25 },
  planTitle: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flexShrink: 1, gap: 8, rowGap: 4 },
  price: { ...text.strong14, flexShrink: 0, color: colors.successText },
  planName: { ...text.strong14, color: colors.text },
  accounts: { ...text.chip, color: colors.infoText },
  description: { ...text.body11, color: colors.textSoft },
  caption: { ...text.caption10, color: colors.textMuted },
});
