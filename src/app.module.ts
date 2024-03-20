import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { RatingModule } from './rating/rating.module';
import { CategoriesModule } from './categories/categories.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    UserModule,
    ProductModule,
    OrderModule,
    RatingModule,
    CategoriesModule,
  ],
})
export class AppModule {}
