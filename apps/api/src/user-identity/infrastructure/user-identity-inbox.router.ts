import { Injectable } from '@nestjs/common';
import {
  InboxReceiveInput,
  InboxRouterHandler,
} from '../../common/inbox/types';
import { CommandBus } from '@nestjs/cqrs';
import { AppError } from '../../common/errors';
import { CreateUserCommand } from '../appliaction/commands/create-user.command';
import { ClerkMapper } from './acl/clerk.mapper';
import { DeleteUserCommand } from '../appliaction/commands/delete-user.command';
import {
  ClerkUserCreatedEvent,
  ClerkUserDeletedEvent,
} from './acl/clerk-events';

@Injectable()
export class UserIdentityInboxRouter implements InboxRouterHandler {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(input: InboxReceiveInput): Promise<void> {
    if (input.source !== 'clerk') {
      throw new AppError('VALIDATION_ERROR', 'Invalid source');
    }

    switch (input.topic) {
      case 'user.created': {
        const userCreatedData = ClerkMapper.mapUserCreated(
          input.payload as ClerkUserCreatedEvent,
        );
        await this.commandBus.execute(
          new CreateUserCommand(
            userCreatedData.email,
            userCreatedData.name,
            userCreatedData.clerkId,
          ),
        );
        break;
      }

      case 'user.deleted': {
        const userDeletedData = ClerkMapper.mapUserDeleted(
          input.payload as ClerkUserDeletedEvent,
        );
        await this.commandBus.execute(
          new DeleteUserCommand(userDeletedData.clerkId),
        );
        break;
      }
      default:
        throw new AppError('VALIDATION_ERROR', 'Invalid topic');
    }
  }
}
