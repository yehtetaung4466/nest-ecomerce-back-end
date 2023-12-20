import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { orders } from 'src/drizzle/schema';

@Injectable()
export class OrderService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async createNewOrder(customerId: number, itemId: number, quantity: number) {
    await this.drizzleService.db
      .insert(orders)
      .values({ customer_id: customerId, item_id: itemId, quantity })
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'orders_item_id_products_id_fk') {
            throw new BadRequestException('item not exit');
          }
          if (err.message === 'Insufficient stock') {
            throw new BadRequestException('Insufficient stock');
          }
          throw new PostgresError(err.stack);
        }
      });
    return { msg: 'successfully created a new order' };
  }
  async getOrdersByUserId(userId: number) {
    const orderS = await this.drizzleService.db
      .select()
      .from(orders)
      .where(eq(orders.customer_id, userId));
    return orderS;
  }
  async getOrderById(orderId: number) {
    const orderS = await this.drizzleService.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!orderS) throw new NotFoundException('order no found');
    return orderS;
  }
}
