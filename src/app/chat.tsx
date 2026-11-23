import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/Button';
import { NavBar } from '../components/NavBar';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { account, chatSeed } from '../data/content';
import { useApp } from '../state/AppState';
import { colors, layout, radius, text } from '../theme';

/**
 * Estructura de un mensaje dentro del hilo de conversación con el asistente.
 */
interface Message {
  /** Identificador único del mensaje */
  id: string;
  /** Origen del mensaje: 'user' (usuario auditante) o 'assistant' (IA de VeriMind) */
  from: 'user' | 'assistant';
  /** Cuerpo de texto del mensaje */
  body: string;
}

/** Semilla inicial de mensajes demostrativos del prototipo */
const initialMessages: Message[] = [
  { id: 'q1', from: 'user', body: chatSeed.userQuestion },
  { id: 'a1', from: 'assistant', body: chatSeed.assistantAnswer },
];

/**
 * Pantalla del Asistente Virtual VeriMind.
 * Permite formular preguntas sobre las anomalías detectadas en la cuenta auditada
 * y recibir recomendaciones automáticas.
 *
 * Adaptabilidad responsive:
 * - Detección dinámica de altura con `useWindowDimensions`: en modo landscape (18:9) o ventanas split (1:1 reducidas),
 *   reduce el tamaño de la cabecera y el resumen para priorizar la lectura del chat.
 * - En pantallas anchas (tablets, 1:1 o landscape), centra el panel a `maxContentWidth` evitando
 *   que los campos y botones se dispersen.
 * - Las burbujas de usuario utilizan `maxWidth: '85%'` en lugar de un ancho porcentual rígido,
 *   evitando que mensajes cortos se estiren a 700+ px en pantallas amplias.
 */
export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { notify, userName, handle } = useApp();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const isCompactHeight = height < 600;

  /** Envía el mensaje actual y simula la respuesta automática de la IA */
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
        <View style={styles.maxWidthWrap}>
          <NavBar title="RESULTADO DEL ANÁLISIS" />
          {!isCompactHeight ? (
            <View style={styles.summary}>
              <ProfilePhoto />
              <View style={styles.identity}>
                <Text style={styles.nickname}>{handle}</Text>
                <Text style={styles.metrics}>
                  {account.followers} seguidores · {account.posts} publicaciones
                </Text>
                <View style={styles.risk}>
                  <View style={styles.riskBar} />
                  <Text style={styles.riskText}>{account.riskLabel}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.summaryCompact}>
              <Text style={styles.nicknameCompact}>{handle}</Text>
              <Text style={styles.riskText}>{account.riskLabel}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 12) + 6 }]}>
        <View style={styles.maxWidthPanel}>
          <View style={styles.assistantHeader}>
            <View style={styles.assistantTile}>
              <BrandMark size={16} />
            </View>
            <Text style={styles.greeting} numberOfLines={isCompactHeight ? 1 : 2}>
              {chatSeed.greeting}
            </Text>
          </View>

          <ScrollView
            ref={scroller}
            style={styles.flex}
            contentContainerStyle={styles.conversation}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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

          {!isCompactHeight ? (
            <Pressable
              onPress={() => router.push('/apoyo')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.plan, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.planText}>Plan sugerido: ver cómo apoyar al creador y moderar los comentarios</Text>
            </Pressable>
          ) : null}

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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.bg },
  maxWidthWrap: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  maxWidthPanel: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    gap: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: layout.screenX,
  },
  summaryCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: layout.screenX,
  },
  identity: { flex: 1, gap: 8 },
  nickname: { ...text.nickname, color: colors.text },
  nicknameCompact: { ...text.heading13, color: colors.text },
  metrics: { ...text.body11, lineHeight: 16, color: colors.textMuted },
  risk: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  riskBar: { width: 4, height: 12, backgroundColor: colors.dangerText },
  riskText: { ...text.chip, color: colors.dangerText },
  panel: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: layout.screenX,
    backgroundColor: colors.chatPanel,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  assistantHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  assistantTile: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoBg,
    borderRadius: 6,
  },
  greeting: { ...text.assistantTitle, flex: 1, color: colors.text },
  conversation: { gap: 10, paddingBottom: 4 },
  bubble: { padding: 12, gap: 6, borderWidth: 1, borderRadius: radius.sm },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    backgroundColor: colors.userBubble,
    borderColor: colors.userBubbleBorder,
  },
  assistantBubble: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  sender: { ...text.sender },
  body: { ...text.body15, color: colors.text },
  plan: {
    padding: 10,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.sm,
  },
  planText: { ...text.strong14, lineHeight: 18, color: colors.infoText },
  messageBar: {
    height: 52,
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
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button,
    borderRadius: radius.sm,
  },
});

