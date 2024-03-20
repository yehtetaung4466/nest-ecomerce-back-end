import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/categories.dto';
import { JwtAdminGuard } from 'src/guards/jwt.admin.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @UseGuards(JwtAdminGuard)
  @Post()
  createNewCategories(@Body() dto: CategoryDto) {
    return this.categoriesService.makeNewCategory(dto.name);
  }
  @Get()
  retrieveAllCategories() {
    return this.categoriesService.getAllCategories();
  }
  @UseGuards(JwtAdminGuard)
  @Delete(':categoryId')
  deleteOneCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.deleteCategoryById(categoryId);
  }
  @UseGuards(JwtAdminGuard)
  @Delete()
  deleteAllCategories() {
    return this.categoriesService.deleteAllCategories();
  }
}
