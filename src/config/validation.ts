import { plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  PORT?: number;

  @IsString()
  MYSQL_HOST!: string;

  @IsInt()
  MYSQL_PORT!: number;

  @IsString()
  MYSQL_USER!: string;

  @IsString()
  MYSQL_PASSWORD!: string;

  @IsString()
  MYSQL_DATABASE!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsInt()
  REDIS_PORT!: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
