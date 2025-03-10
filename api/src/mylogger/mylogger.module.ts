import { Module } from '@nestjs/common';
import { MyLoggerService } from './mylogger.service';

@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService]
})
export class MyLoggerModule {}
