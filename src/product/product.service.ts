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
    const productS = await this.drizzleService.db.select().from(products);
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
    description: string,
    name: string,
    price: number,
    stock: number,
  ) {
    const product = await this.drizzleService.db
      .insert(products)
      .values({ name, price, description, stock, image: file.originalname })
      .returning()
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'products_name_unique') {
            throw new BadRequestException('product name already exit');
          }
          throw new PostgresError(err.stack);
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
  async deleleteProductById(id: number) {
    const deletedProduct = await this.drizzleService.db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    if (!deletedProduct || deletedProduct.length === 0) {
      throw new NotFoundException('product not found thus not deleted');
    }
    await fs
      .rm(`${process.cwd()}/products/${deletedProduct[0].image}`)
      .catch(() => {
        throw new InternalServerErrorException(
          'error while deleting product image',
        );
      });
    return { msg: 'successfully deleted' };
  }
  async deleteAllProducts() {
    const deletedProducts = await this.drizzleService.db.delete(products);
    if (!deletedProducts || deletedProducts.length === 0) {
      throw new NotFoundException('have no producs thus not deleted');
    }
    await fs.rm(`${process.cwd()}/products`, { recursive: true }).catch(() => {
      throw new InternalServerErrorException('error deleting products images');
    });
    return { msg: 'successfully deleted all products' };
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
