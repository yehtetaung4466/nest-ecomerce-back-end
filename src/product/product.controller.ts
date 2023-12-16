import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductDto } from './dto/product.dto';
import * as uuid from 'uuid';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Request, Response } from 'express';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async uploadProducts(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('product image is expected');
    }
    const extension = file.originalname.split('.').pop();
    const newFileName = `products_${uuid.v4()}.${extension}`;
    file.originalname = newFileName;
    return await this.productService.makeNewProduct(
      file,
      product.name,
      product.price,
      product.rating,
    );
  }
  @Get()
  async retrieveAllProducts(@Req() req: Request) {
    const products = await this.productService.getAllProducts();
    products.forEach((p) => {
      p.image = `${req.protocol}://${req.hostname}:3000/products/images/${p.id}`;
    });
    return products;
  }
  @Get(':productId')
  async retrieveOneProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: Request,
  ) {
    const product = await this.productService.getProductById(productId);
    product.image = `${req.protocol}://${req.hostname}:3000/products/images/${product.id}`;
    return product;
  }
  @Get('images/:productId')
  async retrieveOneImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Res() res: Response,
  ) {
    const image = await this.productService.getImageById(productId);
    const filePath = join(process.cwd() + '/products/' + image);
    const stream = createReadStream(filePath);
    return stream.pipe(res);
  }
}
