import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { products } from 'src/drizzle/schema';
import * as fs from 'node:fs/promises';
import { PostgresError } from 'postgres';
import { eq } from 'drizzle-orm';
@Injectable()
export class ProductService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async getAllProducts() {
    const productS =
      (await this.drizzleService.db.query.products.findMany()) as (typeof products.$inferSelect)[];
    return productS;
  }
  async getProductById(id: number) {
    const product = await this.drizzleService.db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }
  async getImageById(id: number) {
    const product = await this.drizzleService.db.query.products.findFirst({
      where: eq(products.id, id),
      columns: {
        image: true,
      },
    });
    if (!product) throw new NotFoundException('image not found');
    return product.image;
  }
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
