import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

/**
 * Muestra la imagen de perfil de la cuenta auditada con bordes redondeados y fondo de reserva.
 */
export function ProfilePhoto() {
  return (
    <Image
      source={require('../../assets/images/profile.png')}
      style={styles.photo}
      accessibilityLabel="Foto de perfil de la cuenta analizada"
    />
  );
}

const styles = StyleSheet.create({
  photo: { width: 88, height: 123, borderRadius: radius.lg, backgroundColor: colors.surface },
});
