import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { ratings } from 'src/drizzle/schema';
import * as dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
@Injectable()
export class RatingService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async makeNewRating(
    rating: number,
    opinion: string,
    customerId: number,
    itemId: number,
  ) {
    await this.drizzleService.db
      .insert(ratings)
      .values({ rating, opinion, customer_id: customerId, item_id: itemId })
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'ratings_item_id_products_id_fk') {
            throw new BadRequestException('item does not exit');
          }
          if (err.constraint_name === 'customerUniqueProduct') {
            throw new BadRequestException(
              'can not make multiple ratings for one product',
            );
          }
          throw new PostgresError(err.stack);
        }
      });
    return { msg: 'successfully created a new rating' };
  }
  async changeRatingById(
    id: number,
    userId: number,
    newRating: number,
    newOpinion: string,
  ) {
    const oldRating = await this.drizzleService.db.query.ratings.findFirst({
      where: eq(ratings.id, id),
    });
    if (!oldRating) {
      throw new NotFoundException('rating does not exit');
    }
    if (userId !== oldRating.customer_id) {
      throw new UnauthorizedException('you are not authorized for this action');
    }
    await this.drizzleService.db
      .update(ratings)
      .set({
        rating: newRating,
        opinion: newOpinion,
        updatedAt: dayjs(Date.now()).toISOString(),
      })
      .where(eq(ratings.id, id));
    return { msg: 'successfully updated rating' };
  }
}
