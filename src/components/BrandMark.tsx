import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

/** Símbolo de VeriMind (vector del archivo de Figma, caja de 32×32). */
export function BrandMark({ size = 32, color = colors.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" aria-hidden={true}>
      <Path
        d="M0 6.4 L8 6.4 L16 19.2 L24 6.4 L32 6.4 L16 32 L0 6.4 Z M24 0 L32 0 L24 12.8 L20 6.4 L24 0 Z"
        fill={color}
      />
    </Svg>
  );
}
