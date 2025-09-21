import { Injectable } from '@nestjs/common';
import { AdminUserApi } from '../ports/admin-user.api';
import { AdminUserView } from '../../views/admin-user.view';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';

@Injectable()
export class AdminUserService implements AdminUserApi {
  constructor(private queryBus: QueryBus) {}

  getUserById(adminUserId: string): Promise<AdminUserView> {
    const query = new GetUserByIdQuery(adminUserId);
    return this.queryBus.execute(query);
  }
}
