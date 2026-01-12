import { Injectable } from '@nestjs/common';
import { Clock } from './clock';

@Injectable()
export class DateFnsClass implements Clock {
  today(): Date {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    return new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
  }

  now(): Date {
    return new Date();
  }

  addDaysFromNow(days: number): Date {
    if (days <= 0) throw new Error('days param must be greater than 0');
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  addMillisecondsFromNow(milliseconds: number): Date {
    if (milliseconds <= 0)
      throw new Error('milliseconds param must be greater than 0');
    return new Date(Date.now() + milliseconds * 1000);
  }

  subtractDaysFromNow(days: number): Date {
    if (days <= 0) throw new Error('days param must be greater than 0');
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }
}
