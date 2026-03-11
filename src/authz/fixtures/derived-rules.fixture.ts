export const DERIVED_RULES_FIXTURE = [
  {
    flag_key: 'telefono_validado_n2',
    scope: 'sociedad',
    conditions_json: { user: { telefono_validado: true }, sociedad: { nivel_in: [2] } },
  },
];
