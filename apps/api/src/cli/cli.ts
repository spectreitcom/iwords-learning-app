import { CommandFactory } from 'nest-commander';
import { AppModule } from '../app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['error', 'warn', 'debug', 'log']);
}

bootstrap().catch((err) => console.error(err));
