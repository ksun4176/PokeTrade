import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { Services } from 'src/utils/constants';

@Module({
  providers: [
    {
      provide: Services.PRISMA,
      useClass: PrismaService
    }
  ],
  exports: [
    {
      provide: Services.PRISMA,
      useClass: PrismaService
    }
  ]
})
export class PrismaModule { }