import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [DrizzleModule],
})
export class CategoriesModule {}
