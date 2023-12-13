import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductDto } from './dto/product.dto';
import * as uuid from 'uuid';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          const extension = file.originalname.split('.').pop();
          const newFileName = `products_${uuid.v4()}.${extension}`;
          file.originalname = newFileName;
          callback(null, file.originalname);
        },
      }),
    }),
  )
  async uploadProducts(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('product image is expected');
    }
    await this.productService.makeNewProduct(
      file,
      product.name,
      product.price,
      product.rating,
    );
  }
}
