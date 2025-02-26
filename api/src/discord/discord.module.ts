import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { DiscordService } from './services/discord.service';
import { DiscordController } from './controllers/discord.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TradeModule } from 'src/trade/trade.module';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    PokemonModule,
    TradeModule,
  ],
  controllers: [DiscordController],
  providers: [
    {
      provide: Services.DISCORD,
      useClass: DiscordService,
    }
  ],
})
export class DiscordModule {}
