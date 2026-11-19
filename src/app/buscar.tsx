import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { IconRow } from '../components/IconRow';
import { Logo } from '../components/Logo';
import { Screen } from '../components/Screen';
import { StatusTag } from '../components/StatusTag';
import { contenedor } from '../composition';
import { analysisItems, plans } from '../data/content';
import { useApp } from '../state/AppState';
import { colors, radius, text } from '../theme';

/** VeriMind · Búsqueda y extracción */
export default function SearchScreen() {
  const router = useRouter();
  const { plan, userName, setHandle: guardarUsuario } = useApp();
  const [handle, setHandle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [analizando, setAnalizando] = useState(false);

  const planName = plans.find((p) => p.id === plan)?.name;

  const analyze = async () => {
    if (analizando) return;
    setError(null);
    setAnalizando(true);
    const resultado = await contenedor.analisis.analizarCuenta.ejecutar({ usuario: handle });
    setAnalizando(false);
    if (resultado.esFallo) {
      setError(resultado.error);
      return;
    }
    guardarUsuario(resultado.valor.handle.valor);
    router.push('/procesando');
  };

  return (
    <Screen
      contentStyle={styles.content}
      footer={<Button variant="outline" label="Elige tu plan" onPress={() => router.push('/planes')} />}
    >
      <View style={styles.topRow}>
        <Logo />
        {plan === 'trial' ? (
          <StatusTag tone="warning" label="Prueba gratuita · 6 días restantes" />
        ) : (
          <StatusTag tone="success" label={`Plan ${planName} · activo`} />
        )}
      </View>

      <Text style={[styles.greeting, { marginTop: 49 }]}>¡Hola {userName}!</Text>
      <Text style={[styles.lead, { marginTop: 49 }]}>Bienvenido al centro de auditoría</Text>

      <View style={[styles.searchRow, { marginTop: 113 }]}>
        <View style={styles.searchField}>
          <TextInput
            value={handle}
            onChangeText={setHandle}
            placeholder="Ingresar @usuario público de TikTok..."
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.blue}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={analyze}
            style={styles.searchInput}
            accessibilityLabel="Usuario público de TikTok"
          />
        </View>
        <Button variant="compact" label="Analizar" onPress={analyze} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={[styles.list, { marginTop: 33 }]}>
        <Text style={styles.listTitle}>Qué analizaremos</Text>
        {analysisItems.map((item) => (
          <IconRow key={item.id} icon={item.icon} title={item.title} description={item.description} />
        ))}
        <Text style={styles.disclaimer}>Solo cuentas públicas. Los resultados son indicios estadísticos, no pruebas.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 23 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  greeting: { ...text.greeting, color: colors.text },
  lead: { ...text.lead16, color: colors.textMuted },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchField: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  searchInput: { ...text.body13, color: colors.text, paddingVertical: 0 },
  list: { gap: 8 },
  listTitle: { ...text.label13, color: colors.text },
  disclaimer: { ...text.caption10, color: colors.textMuted },
  error: { ...text.caption10, color: colors.dangerText, marginTop: 8 },
});