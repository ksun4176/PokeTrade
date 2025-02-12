import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
