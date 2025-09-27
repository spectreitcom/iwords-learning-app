import { Injectable } from '@nestjs/common';
import { BoxApi } from '../ports/box.api';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBoxCommand } from '../commands/create-box.command';

@Injectable()
export class BoxApiService implements BoxApi {
  constructor(private readonly commandBus: CommandBus) {}

  async createBox(title: string): Promise<void> {
    const command = new CreateBoxCommand(title);
    return await this.commandBus.execute(command);
  }
}
