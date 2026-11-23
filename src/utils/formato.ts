/**
 * Utilidades de formato, normalización y validación de cadenas de texto
 * para el flujo de autenticación y auditoría de cuentas públicas.
 */

/**
 * Extrae y capitaliza el primer nombre a partir de una dirección de correo corporativo.
 *
 * @example
 * nombreDesdeCorreo('carlos.perez@empresa.com') // 'Carlos'
 *
 * @param correo - Dirección de correo electrónico ingresada por el usuario.
 * @returns El nombre formateado con la inicial en mayúscula, o 'Carlos' por defecto.
 */
export function nombreDesdeCorreo(correo: string): string {
  const local = correo.trim().split('@')[0] ?? '';
  const primera = local.split(/[._\-+0-9]+/).filter(Boolean)[0] ?? '';
  if (!primera) return 'Carlos';
  return primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase();
}

/**
 * Normaliza un identificador o usuario de red social (ej. TikTok),
 * eliminando arrobas duplicadas, espacios en blanco y garantizando el prefijo '@'.
 *
 * @example
 * normalizarUsuario('  @@carlospati  ') // '@carlospati'
 * normalizarUsuario('') // '@carlospati' (cuenta por defecto para el prototipo)
 *
 * @param texto - Texto o handle ingresado en el buscador.
 * @returns Handle limpio con formato '@usuario' o el usuario demo por defecto.
 */
export function normalizarUsuario(texto: string): string {
  const limpio = texto.trim().replace(/^@+/, '').replace(/\s+/g, '');
  return limpio ? `@${limpio}` : '@carlospati';
}

/**
 * Valida si una cadena de texto corresponde a un formato de correo electrónico estándar.
 *
 * @param correo - Cadena a evaluar.
 * @returns `true` si cumple con la expresión regular de correo válido, `false` de lo contrario.
 */
export function correoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}
