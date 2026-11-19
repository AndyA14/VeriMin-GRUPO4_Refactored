import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Logo } from '../components/Logo';
import { Screen } from '../components/Screen';
import { useApp } from '../state/AppState';
import { contenedor } from '../composition';
import { colors, fonts, radius, text } from '../theme';

/** VeriMind · Login corporativo */
export default function LoginScreen() {
  const router = useRouter();
  const { setUserName } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const iniciarSesion = async () => {
    const resultado = await contenedor.identidad.iniciarSesion.ejecutar({ email, clave: password });
    if (resultado.esFallo) return setError(resultado.error);
    setError(null);
    setUserName(resultado.valor.nombre);
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
          style={styles.hero}
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
  content: { paddingTop: 23, gap: 30 },
  hero: {
    height: 173,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'flex-end',
    backgroundColor: colors.surface,
  },
  heroTag: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 0.17, color: colors.infoText },
  welcome: { gap: 9 },
  title: { ...text.display30, color: colors.text },
  subtitle: { ...text.body13, color: colors.textMuted },
  fields: { gap: 12 },
  error: { ...text.caption10, color: colors.dangerText },
  footer: { alignItems: 'center', gap: 16 },
  stretch: { alignSelf: 'stretch' },
  security: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  securityText: { ...text.caption10, color: colors.textMuted },
});
