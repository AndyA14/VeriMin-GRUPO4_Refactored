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

/**
 * Pantalla Principal de Búsqueda y Auditoría de VeriMind.
 * Permite ingresar cualquier nombre de usuario público de redes (TikTok)
 * e iniciar el escaneo heurístico de autenticidad y toxicidad.
 *
 * Adaptabilidad responsive:
 * - Reemplazo de márgenes fijos rígidos (anteriores 113px) por espaciados relativos elásticos (`gap` y márgenes moderados),
 *   asegurando que en relaciones 1:1 (plegables/split-screen) y 18:9 (landscape) el formulario sea visible de inmediato.
 */
export default function SearchScreen() {
  const router = useRouter();
  const { plan, userName, setHandle: guardarUsuario } = useApp();
  const [handle, setHandle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [analizando, setAnalizando] = useState(false);

  const planName = plans.find((p) => p.id === plan)?.name;

  /** Ejecuta el análisis de la cuenta mediante el caso de uso del contenedor DDD */
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

      <View style={styles.headerBlock}>
        <Text style={styles.greeting}>¡Hola {userName}!</Text>
        <Text style={styles.lead}>Bienvenido al centro de auditoría</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
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
      </View>

      <View style={styles.list}>
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
  content: { paddingTop: 20, gap: 28 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  headerBlock: { gap: 12 },
  greeting: { ...text.greeting, color: colors.text },
  lead: { ...text.lead16, color: colors.textMuted },
  searchSection: { gap: 10 },
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
  list: { gap: 8, paddingBottom: 16 },
  listTitle: { ...text.label13, color: colors.text },
  disclaimer: { ...text.caption10, color: colors.textMuted },
  error: { ...text.caption10, color: colors.dangerText, marginTop: 8 },
});
