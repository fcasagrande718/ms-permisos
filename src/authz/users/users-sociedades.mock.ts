import { Injectable } from '@nestjs/common';
import { UsersSociedadesProvider } from './users-client.interface';
import { SOCIEDADES_FIXTURE } from '../fixtures/sociedades.fixture';

@Injectable()
export class UsersSociedadesMockProvider implements UsersSociedadesProvider {
  async getSociedadesByUser(uuid: number) {
    return SOCIEDADES_FIXTURE[uuid] ?? [];
  }
}
