export default () => ({
  port: parseInt(process.env.PORT ?? '8000', 10),
  usersBaseUrl: process.env.USERS_BASE_URL ?? 'http://ms-usuarios:8001',
  defaultTerminosDcp: (process.env.DEFAULT_TERMINOS_DCP ?? 'false') === 'true',
  defaultPreguntasFrecuentesDcp:
    (process.env.DEFAULT_PREGUNTAS_FRECUENTES_DCP ?? 'false') === 'true',
  db: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
    username: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? 'root',
    database: process.env.MYSQL_DATABASE ?? 'ms_permisos',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  contextTtlSeconds: 3600,
});
