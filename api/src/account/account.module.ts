import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountController } from './controllers/account.controller';
import { TradeModule } from 'src/trade/trade.module';
import { Services } from 'src/utils/constants';
import { AccountService } from './services/account.service';

@Module({
  imports: [
    PrismaModule,
    TradeModule,
  ],
  controllers: [AccountController],
  providers: [
    {
      provide: Services.ACCOUNT,
      useClass: AccountService
    }
  ],
  exports: [
    {
      provide: Services.ACCOUNT,
      useClass: AccountService
    }
  ]
})
export class AccountModule {}
