import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/Button';
import { NavBar } from '../components/NavBar';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { contenedor } from '../composition';
import type { CuentaCreador } from '../contexts/analisis/domain/CuentaCreador';
import { chatSeed } from '../data/content';
import { useApp } from '../state/AppState';
import { colors, layout, radius, text } from '../theme';

interface Message {
  id: string;
  from: 'user' | 'assistant';
  body: string;
}

const initialMessages: Message[] = [
  { id: 'q1', from: 'user', body: chatSeed.userQuestion },
  { id: 'a1', from: 'assistant', body: chatSeed.assistantAnswer },
];

/** VeriMind · Asistente */
export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notify, userName } = useApp();
  const [cuenta, setCuenta] = useState<CuentaCreador | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    let activo = true;
    contenedor.analisis.obtenerResultado.ejecutar().then((resultado) => {
      if (activo && resultado.esExitoso) setCuenta(resultado.valor);
    });
    return () => {
      activo = false;
    };
  }, []);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    const stamp = Date.now().toString();
    setMessages((prev) => [...prev, { id: `u${stamp}`, from: 'user', body }]);
    setDraft('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `a${stamp}`, from: 'assistant', body: chatSeed.cannedReply }]);
    }, 600);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: insets.top }}>
        <NavBar title="RESULTADO DEL ANÁLISIS" />
        <View style={styles.summary}>
          <ProfilePhoto />
          <View style={styles.identity}>
            <Text style={styles.nickname}>{cuenta ? cuenta.handle.valor : ''}</Text>
            <Text style={styles.metrics}>
              {cuenta ? `${cuenta.seguidores} seguidores  ·  ${cuenta.publicaciones} publicaciones` : ''}
            </Text>
            <View style={styles.risk}>
              <View style={styles.riskBar} />
              <Text style={styles.riskText}>{cuenta ? cuenta.riesgo.etiqueta : ''}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <View style={styles.assistantHeader}>
          <View style={styles.assistantTile}>
            <BrandMark size={18} />
          </View>
          <Text style={styles.greeting}>{chatSeed.greeting}</Text>
        </View>

        <ScrollView
          ref={scroller}
          style={styles.flex}
          contentContainerStyle={styles.conversation}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) =>
            m.from === 'user' ? (
              <View key={m.id} style={[styles.bubble, styles.userBubble]}>
                <Text style={[styles.sender, { color: colors.infoText }]}>{userName}</Text>
                <Text style={styles.body}>{m.body}</Text>
              </View>
            ) : (
              <View key={m.id} style={[styles.bubble, styles.assistantBubble]}>
                <Text style={[styles.sender, { color: colors.textMuted }]}>Asistente de IA</Text>
                <Text style={styles.body}>{m.body}</Text>
              </View>
            ),
          )}
        </ScrollView>

        <Pressable
          onPress={() => router.push('/apoyo')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.plan, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.planText}>Plan sugerido: ver cómo apoyar al creador y moderar los comentarios</Text>
        </Pressable>

        <View style={styles.messageBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribe tu consulta aquí..."
            placeholderTextColor={colors.placeholder}
            selectionColor={colors.blue}
            returnKeyType="send"
            onSubmitEditing={send}
            style={styles.input}
            accessibilityLabel="Escribe tu consulta"
          />
          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="Enviar"
            style={({ pressed }) => [styles.send, pressed && { opacity: 0.85 }]}
          >
            <Send size={18} color={colors.onBlue} strokeWidth={2} absoluteStrokeWidth />
          </Pressable>
        </View>

        <Button
          label="Descargar reporte de verificación (PDF)"
          onPress={() => notify('Reporte de verificación generado (PDF)')}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.bg },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 8, paddingBottom: 20, paddingHorizontal: layout.screenX },
  identity: { flex: 1, gap: 8 },
  nickname: { ...text.nickname, color: colors.text },
  metrics: { ...text.body11, lineHeight: 16, color: colors.textMuted },
  risk: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  riskBar: { width: 4, height: 12, backgroundColor: colors.dangerText },
  riskText: { ...text.chip, color: colors.dangerText },
  panel: {
    flex: 1,
    gap: 16,
    paddingTop: 18,
    paddingHorizontal: layout.screenX,
    backgroundColor: colors.chatPanel,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  assistantHeader: { flexDirection: 'row', gap: 10 },
  assistantTile: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoBg,
    borderRadius: 6,
  },
  greeting: { ...text.assistantTitle, flex: 1, color: colors.text },
  conversation: { gap: 12, paddingBottom: 4 },
  bubble: { padding: 12, gap: 6, borderWidth: 1, borderRadius: radius.sm },
  userBubble: { alignSelf: 'flex-end', width: '88%', backgroundColor: colors.userBubble, borderColor: colors.userBubbleBorder },
  assistantBubble: { alignSelf: 'stretch', backgroundColor: colors.surface, borderColor: colors.border },
  sender: { ...text.sender },
  body: { ...text.body15, color: colors.text },
  plan: {
    padding: 12,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.sm,
  },
  planText: { ...text.strong14, lineHeight: 20, color: colors.infoText },
  messageBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
  },
  input: { ...text.body14, flex: 1, color: colors.text, paddingVertical: 0 },
  send: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button,
    borderRadius: radius.sm,
  },
});
