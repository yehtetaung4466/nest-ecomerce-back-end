import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { ratings } from 'src/drizzle/schema';

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
      .values({ rating, opinion, customer_id: customerId, item_id: itemId });
    return { msg: 'successfully created a new rating' };
  }
}
