import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { products } from 'src/drizzle/schema';
import * as fs from 'node:fs/promises';
import { PostgresError } from 'postgres';
import { eq } from 'drizzle-orm';
@Injectable()
export class ProductService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async makeNewProduct(
    file: Express.Multer.File,
    name: string,
    price: number,
    rating?: number,
  ) {
    const product = await this.drizzleService.db
      .insert(products)
      .values({ name, price, rating, image: file.originalname })
      .returning()
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'product_name_unique') {
            throw new BadRequestException('product name already exit');
          }
        }
      });
    if (!product) {
      throw new PostgresError('error while insertion product');
    }
    return await this.handleProductImageUpload(file).catch(async () => {
      await this.drizzleService.db
        .delete(products)
        .where(eq(products.id, product[0].id));
      throw new InternalServerErrorException('error writing product image');
    });
  }

  private async handleProductImageUpload(file: Express.Multer.File) {
    await fs.mkdir(`${process.cwd()}/products`, { recursive: true });
    await fs.writeFile(
      `${process.cwd()}/products/${file.originalname}`,
      file.buffer,
    );
    return { msg: 'success' };
  }
}
