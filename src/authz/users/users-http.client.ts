import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UsersClientInterface, UserProfile } from './users-client.interface';

@Injectable()
export class UsersHttpClient implements UsersClientInterface {
  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async getUserProfile(uuid: number): Promise<UserProfile> {
    const baseUrl = this.configService.get<string>('usersBaseUrl');
    const resp = await firstValueFrom(this.httpService.get(`${baseUrl}/api/v1/usuarios/${uuid}`));
    const data = resp.data ?? {};
    return {
      uuid,
      perfil: Number(data.perfil ?? 3),
      mail_validado: Boolean(data.mail_validado),
      telefono_validado: Boolean(data.telefono_validado),
      terminos_condiciones_dcp: Boolean(
        data.terminos_condiciones_dcp ?? this.configService.get<boolean>('defaultTerminosDcp'),
      ),
      preguntas_frecuentes_dcp: Boolean(
        data.preguntas_frecuentes_dcp ??
          this.configService.get<boolean>('defaultPreguntasFrecuentesDcp'),
      ),
    };
  }
}
