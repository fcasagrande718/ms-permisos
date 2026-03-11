import { UserProfile } from '../users/users-client.interface';

export const USERS_FIXTURE: Record<number, UserProfile> = {
  108387: {
    uuid: 108387,
    perfil: 3,
    mail_validado: true,
    telefono_validado: false,
    terminos_condiciones_dcp: true,
    preguntas_frecuentes_dcp: false,
  },
  200001: {
    uuid: 200001,
    perfil: 2,
    mail_validado: true,
    telefono_validado: true,
    terminos_condiciones_dcp: false,
    preguntas_frecuentes_dcp: false,
  },
  900001: {
    uuid: 900001,
    perfil: 1,
    mail_validado: true,
    telefono_validado: true,
    terminos_condiciones_dcp: true,
    preguntas_frecuentes_dcp: true,
  },
};
