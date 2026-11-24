import { Email } from './Email';
import { Usuario } from './Usuario';

/**
 * Puerto de salida: cómo el dominio necesita guardar y buscar usuarios.
 * La implementación (memoria, API, storage) vive en infrastructure/.
 */
export interface RepositorioUsuarioPort {
  buscarPorEmail(email: Email): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<void>;
}