# ms-permisos

Microservicio de permisos con NestJS + TypeScript + MySQL + Redis.

## Levantar con Docker

```bash
docker compose up --build
```

## Correr migrations

```bash
npm run migration:run
```

## Seed inicial

```bash
npm run seed
```

## Ejecutar local

```bash
npm install
npm run build
npm run start
```

## Tests

```bash
npm test
npm run test:e2e
```

## OpenAPI

Ver `docs/openapi.yaml`.

## Ejemplos curl

```bash
curl -s localhost:8000/context -H 'Uuid: 108387' -H 'User-Profile: 3'
curl -s 'localhost:8000/internal/authorize?key=faena.ver&resource_type=faena&resource_id=15' -H 'Uuid: 108387' -H 'User-Profile: 3'
curl -s localhost:8000/context -H 'Uuid: 108387' -H 'User-Profile: 3' -H 'Impersonate: true' -H 'Impersonator-Uuid: 900001'
```
