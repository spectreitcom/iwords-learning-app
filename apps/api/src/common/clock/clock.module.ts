import { Module } from '@nestjs/common';
import { Clock } from './clock';
import { DateFnsClass } from './date-fns.class';

@Module({
  providers: [
    {
      provide: Clock,
      useClass: DateFnsClass,
    },
  ],
  exports: [Clock],
})
export class ClockModule {}
