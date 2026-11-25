import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { BrandMark } from './BrandMark';

/**
 * Componente de identidad corporativa VeriMind Analytics (isotipo + logotipo textual).
 */
export function Logo() {
  return (
    <View style={styles.row} accessible accessibilityLabel="VeriMind Analytics">
      <View style={styles.mark}>
        <BrandMark size={32} />
      </View>
      <View style={styles.brand}>
        <Text style={styles.name}>VeriMind</Text>
        <Text style={styles.sub}>ANALYTICS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 34 },
  mark: { width: 32, height: 32, marginTop: 2 },
  brand: { gap: 1 },
  name: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 22, letterSpacing: -0.11, color: colors.text },
  sub: { fontFamily: fonts.medium, fontSize: 9, lineHeight: 11, letterSpacing: 0.21, color: colors.textMuted },
});
