import { IsNumber } from 'class-validator';

export class InvalidateContextDto {
  @IsNumber()
  uuid!: number;
}
