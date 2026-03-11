import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator';

export class AuthorizeQueryDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsNumberString()
  sociedad_id?: string;

  @IsOptional()
  @IsString()
  resource_type?: string;

  @IsOptional()
  @IsNumberString()
  resource_id?: string;

  @IsOptional()
  @IsBooleanString()
  require_context?: string;
}
