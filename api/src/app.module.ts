import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { TradeModule } from './trade/trade.module';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UserModule,
    PokemonModule,
    TradeModule,
    AccountModule,
    DiscordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
