import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { UserService } from './services/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './controllers/user.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule
  ],
  controllers: [UserController],
  providers: [
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
