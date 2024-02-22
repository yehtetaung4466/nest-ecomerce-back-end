import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [DrizzleModule],
  controllers: [ProductController],
  providers: [ProductService, CategoriesService],
})
export class ProductModule {}
