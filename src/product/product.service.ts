import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { products } from 'src/drizzle/schema';
import * as fs from 'node:fs/promises';
@Injectable()
export class ProductService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async makeNewProduct(
    file: Express.Multer.File,
    name: string,
    price: number,
    rating?: number,
  ) {
    // Perform the database operation first
    await this.drizzleService.db
      .insert(products)
      .values({ name, price, rating, image: file.originalname });
    await this.handleProductImageUpload(file);
  }

  private async handleProductImageUpload(file: Express.Multer.File) {
    await fs.writeFile(`${process.cwd}/products`, file.buffer);
    return { msg: 'success' };
  }
}
