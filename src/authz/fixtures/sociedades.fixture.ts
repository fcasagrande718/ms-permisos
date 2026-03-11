import { UserSociedad } from '../users/users-client.interface';

export const SOCIEDADES_FIXTURE: Record<number, UserSociedad[]> = {
  108387: [
    {
      sociedad_id: 7806,
      nivel: 1,
      attrs: {
        transportista: false,
        adelanto_financiero: false,
        pago_cheque: true,
        pago_echeque: false,
        pago_terceros: true,
      },
    },
  ],
  200001: [
    {
      sociedad_id: 85104,
      nivel: 2,
      attrs: {
        transportista: false,
        adelanto_financiero: true,
        pago_cheque: false,
        pago_echeque: true,
        pago_terceros: false,
      },
    },
  ],
  900001: [],
};
