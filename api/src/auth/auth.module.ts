import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { Services } from 'src/utils/constants';
import { DiscordStrategy } from './utils/DiscordStrategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionSerializer } from './utils/SessionSerializer';

@Module({
  imports: [
    PassportModule,
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
    SessionSerializer,
    {
      provide: Services.AUTH,
      useClass: AuthService
    }
  ]
})
export class AuthModule {}
