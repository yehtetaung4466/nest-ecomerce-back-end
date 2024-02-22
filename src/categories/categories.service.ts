import { ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { categories } from 'src/drizzle/schema';
import { checkIfPostgresError, handleDbError } from 'src/helpers';

@Injectable()
export class CategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async makeNewCategory(name: string) {
    await this.drizzleService.db
      .insert(categories)
      .values({ name })
      .catch((err) => {
        handleDbError(
          checkIfPostgresError(err).constraint_name ===
            'categories_name_unique',
          err,
          () => {
            throw new ConflictException('category with same name exit');
          },
        );
      });
    return { msg: 'successfully created a category' };
  }
  async getAllCategories() {
    const categorieS = await this.drizzleService.db.select().from(categories);
    return { categories: categorieS };
  }
  async checkIfCategoryExit(id: number) {
    return !!(await this.drizzleService.db.query.categories.findFirst({
      where: eq(categories.id, id),
    }));
  }
}
