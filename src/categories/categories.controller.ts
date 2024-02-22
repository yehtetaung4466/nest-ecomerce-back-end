import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post()
  createNewCategories(@Body() dto: CategoryDto) {
    return this.categoriesService.makeNewCategory(dto.name);
  }
  @Get()
  retrieveAllCategories() {
    return this.categoriesService.getAllCategories();
  }
}
