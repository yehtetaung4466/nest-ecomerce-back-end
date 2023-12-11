import { Injectable } from '@nestjs/common';
import * as postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService {
  constructor(private configService: ConfigService) {}
  private readonly connection = postgres(this.configService.get('DB_URL'));
  public db = drizzle(this.connection, {
    schema,
  });
}