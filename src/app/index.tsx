import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Logo } from '../components/Logo';
import { Screen } from '../components/Screen';
import { useApp } from '../state/AppState';
import { correoValido, nombreDesdeCorreo } from '../utils/formato';
import { colors, fonts, radius, text } from '../theme';

/**
 * Pantalla de Inicio de Sesión Corporativo de VeriMind.
 * Valida credenciales empresariales y extrae el nombre del usuario para personalizar la sesión.
 *
 * Adaptabilidad responsive:
 * - Adapta la altura del hero editorial (`hero`) en pantallas con baja altura (landscape 18:9 o 1:1 compacto)
 *   para mantener los campos y el botón de acción visibles de inmediato.
 * - Integración con `KeyboardAvoidingView` para evitar ocultamiento de campos bajo el teclado en iOS/Android.
 */
export default function LoginScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { setUserName } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isCompact = height < 600;

  /** Valida el correo y longitud mínima de contraseña antes de ingresar */
  const iniciarSesion = () => {
    if (!correoValido(email)) return setError('Ingresa un correo corporativo válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    setError(null);
    setUserName(nombreDesdeCorreo(email));
    router.replace('/buscar');
  };

  const footer = (
    <View style={styles.footer}>
      <Button label="Iniciar Sesión" semiBold onPress={iniciarSesion} style={styles.stretch} />
      <View style={styles.security}>
        <ShieldCheck size={12} color={colors.textMuted} strokeWidth={1.4} absoluteStrokeWidth />
        <Text style={styles.securityText}>Entorno corporativo protegido</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen footer={footer} contentStyle={styles.content}>
        <Logo />

        <ImageBackground
          source={require('../../assets/images/login-hero.png')}
          style={[styles.hero, isCompact && styles.heroCompact]}
          accessibilityLabel="Fotografía editorial"
        >
          <Text style={styles.heroTag}>INTELIGENCIA QUE PROTEGE.</Text>
        </ImageBackground>

        <View style={styles.welcome}>
          <Text style={styles.title}>Tu próximo movimiento, con certeza.</Text>
          <Text style={styles.subtitle}>Accede a tu espacio de auditoría corporativa.</Text>
        </View>

        <View style={styles.fields}>
          <Field
            icon={Mail}
            placeholder="Ingresar Correo Corporativo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Field
            icon={LockKeyhole}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: 20, gap: 24 },
  hero: {
    height: 173,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'flex-end',
    backgroundColor: colors.surface,
  },
  heroCompact: {
    height: 100,
    padding: 12,
  },
  heroTag: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 0.17, color: colors.infoText },
  welcome: { gap: 8 },
  title: { ...text.display30, color: colors.text },
  subtitle: { ...text.body13, color: colors.textMuted },
  fields: { gap: 12 },
  error: { ...text.caption10, color: colors.dangerText },
  footer: { alignItems: 'center', gap: 16 },
  stretch: { alignSelf: 'stretch' },
  security: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  securityText: { ...text.caption10, color: colors.textMuted },
});

