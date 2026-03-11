export interface UserProfile {
  uuid: number;
  perfil: number;
  mail_validado: boolean;
  telefono_validado: boolean;
  terminos_condiciones_dcp: boolean;
  preguntas_frecuentes_dcp: boolean;
}

export interface UserSociedad {
  sociedad_id: number;
  nivel: number;
  attrs: Record<string, boolean>;
}

export interface UsersClientInterface {
  getUserProfile(uuid: number): Promise<UserProfile>;
}

export interface UsersSociedadesProvider {
  getSociedadesByUser(uuid: number): Promise<UserSociedad[]>;
}
