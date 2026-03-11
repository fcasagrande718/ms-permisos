export interface ContextResponseDto {
  user_id: number;
  perfil_usuario: string;
  user_attrs: {
    mail_validado: boolean;
    telefono_validado: boolean;
    terminos_condiciones_dcp: boolean;
    preguntas_frecuentes_dcp: boolean;
  };
  sociedades: Array<{
    sociedad_id: number;
    nivel: number;
    attrs: Record<string, boolean>;
  }>;
  keys_por_sociedad: Record<string, string[]>;
  keys_global: string[];
  keys_flat: string[];
  ttl_seconds: number;
}
