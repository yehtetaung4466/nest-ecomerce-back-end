/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { orderComments, orders, users } from 'src/drizzle/schema';
import { checkIfPostgresError, handleDbError } from 'src/helpers';
import { Denied_Order, Order } from 'src/utils/interfaces';
type OrderWithoutGroupId = Omit<
  typeof orders.$inferSelect,
  'group_id' | 'customer_id'
>;
@Injectable()
export class OrderService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async createNewOrder(
    customerId: number,
    orderGroupId: string,
    comment: string,
    order_s: Order[],
  ) {
    const deniedOrders: Denied_Order[] = [];
    const orderComment = await this.drizzleService.db
      .insert(orderComments)
      .values({ comment, group_id: orderGroupId })
      .returning()
      .catch((err: any) => {
        handleDbError(
          checkIfPostgresError(err).constraint_name ===
            'order_comments_group_id_unique',
          err,
          () => {
            throw new ConflictException('orderGroupId must be unique');
          },
        );
      });
    for (let i = 0; i < order_s.length; i++) {
      const o = order_s[i];
      try {
        await this.drizzleService.db.insert(orders).values({
          item_id: o.itemId,
          quantity: o.quantity,
          customer_id: customerId,
          group_id: orderGroupId,
        });
      } catch (err) {
        handleDbError(
          checkIfPostgresError(err).constraint_name ===
            'orders_customer_id_users_id_fk',
          err,
          async () => {
            await this.drizzleService.db
              .delete(orderComments)
              .where(eq(orderComments.id, orderComment[0].id));
            throw new UnauthorizedException('unauthorized');
          },
        );
        handleDbError(
          checkIfPostgresError(err).message === 'Insufficient stock',
          err,
          () =>
            deniedOrders.push({
              itemId: o.itemId,
              quantity: o.quantity,
              reason: 'Insufficient stock',
            }),
        );
        handleDbError(
          checkIfPostgresError(err).constraint_name ===
            'orders_item_id_products_id_fk',
          err,
          () => {
            deniedOrders.push({
              itemId: o.itemId,
              quantity: o.quantity,
              reason: 'item does not exit',
            });
          },
        );
      }
    }
    if (deniedOrders.length > 0) {
      return {
        deniedOrders,
        msg: `successfully created a new order except ${deniedOrders.length}`,
      };
    } else {
      return { msg: 'successfully created a new order' };
    }
  }

  async getOrdersByUserId(userId: number) {
    const orderS = await this.drizzleService.db.query.orders.findMany({
      where: eq(orders.customer_id, userId),
      with: {
        order_comment: true,
        item: {
          columns: { price: true },
        },
      },
    });
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    const res: {
      orderGroupId: string;
      comment: string;
      orders: OrderWithoutGroupId[];
      total: number;
    }[] = [];
    orderS.forEach((o) => {
      const index = res.findIndex((res) => res.orderGroupId === o.group_id);
      if (index !== -1) {
        const {
          order_comment,
          group_id,
          customer_id,
          item,
          ...noCommentAndGroupIdObj
        } = o;
        res[index].total += item.price;
        res[index].orders.push(noCommentAndGroupIdObj);
      } else {
        res.push({
          orderGroupId: o.group_id,
          comment: o.order_comment.comment,
          orders: [],
          total: 0,
        });
        const {
          order_comment,
          group_id,
          item,
          customer_id,
          ...noCommentAndGroupIdObj
        } = o;
        res[res.length - 1].orders.push(noCommentAndGroupIdObj);
        res[res.length - 1].total += item.price;
      }
    });
    return { user, orderObjArray: res };
  }
  async getOrderById(orderId: number) {
    const orderS = await this.drizzleService.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!orderS) throw new NotFoundException('order not found');
    return orderS;
  }
}
