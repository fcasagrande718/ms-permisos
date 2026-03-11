import { Injectable } from '@nestjs/common';
import { ContextService } from './context.service';

@Injectable()
export class InvalidateService {
  constructor(private readonly contextService: ContextService) {}

  async invalidate(uuid: number): Promise<void> {
    await this.contextService.invalidate(uuid);
  }
}
