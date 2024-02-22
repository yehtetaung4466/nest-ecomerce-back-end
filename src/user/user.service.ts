import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';

@Injectable()
export class UserService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async getUserbyId(id: number) {
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  }
  async userExit(id: number) {
    const userExit = !!(await this.getUserbyId(id));
    return userExit;
  }
}
