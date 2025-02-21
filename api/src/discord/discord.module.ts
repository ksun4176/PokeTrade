import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { DiscordService } from './services/discord.service';

@Module({
  providers: [
    {
      provide: Services.DISCORD,
      useClass: DiscordService,
    }
  ],
  exports: [
    {
      provide: Services.DISCORD,
      useClass: DiscordService,
    }
  ],
})
export class DiscordModule {}
