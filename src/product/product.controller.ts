import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PriceChnDto, ProductDto, StockChnDto } from './dto/product.dto';
import * as uuid from 'uuid';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  createNewProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('image is required');
    }
    if (!file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
      throw new BadRequestException(
        'image must be format of jpg|webp|png|jpeg',
      );
    }
    const extension = file.originalname.split('.').pop();
    const newFileName = `products_${uuid.v4()}.${extension}`;
    file.originalname = newFileName;
    return this.productService.makeNewProduct(
      file,
      product.description,
      product.name,
      product.price,
      product.stock,
    );
  }
  @Get()
  async retrieveAllProducts(@Req() req: Request) {
    const products = await this.productService.getAllProducts();
    const port = this.configService.get('PORT') as string | undefined;
    products.forEach((p) => {
      p.image = `${req.protocol}://${req.hostname}${port ? `:${port}` : ''}/products/images/${p.id}`;
    });
    return products;
  }
  @Get(':productId')
  async retrieveOneProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: Request,
  ) {
    const product = await this.productService.getProductById(productId);
    const port = this.configService.get('PORT') as string | undefined;
    product.image = `${req.protocol}://${req.hostname}${port ? `:${port}` : ''}/products/images/${product.id}`;
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
  @Delete(':productId')
  deleteOneProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.deleleteProductById(productId);
  }
  @Delete()
  deleteAllProducts() {
    return this.productService.deleteAllProducts();
  }
  @Patch(':productId/stock')
  changeStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: StockChnDto,
  ) {
    return this.productService.changeStockOfProductById(productId, dto.stock);
  }
  @Patch(':productId/price')
  changePrice(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: PriceChnDto,
  ) {
    return this.productService.changePriceOfProductById(productId, dto.price);
  }
  @Patch(':productId/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  changeImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    if (!file) {
      throw new BadRequestException('image is required');
    }
    if (!file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
      throw new BadRequestException(
        'image must be format of jpg|webp|png|jpeg',
      );
    }
    const extension = file.originalname.split('.').pop();
    const newFileName = `products_${uuid.v4()}.${extension}`;
    file.originalname = newFileName;
    return this.productService.changeImageofProductById(productId, file);
  }
}
