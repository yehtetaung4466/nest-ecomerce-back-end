import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductDto } from './dto/product.dto';
import * as uuid from 'uuid';
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
  async retrieveAllProducts() {
    return this.productService.getAllProducts();
  }
  @Get(':productId')
  async retrieveOneProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.productService.getProductById(productId);
  }
}
