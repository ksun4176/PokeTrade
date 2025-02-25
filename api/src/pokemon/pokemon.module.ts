import { Module } from "@nestjs/common";
import { PokemonController } from "./controllers/pokemon.controller";
import { Services } from "src/utils/constants";
import { PokemonService } from "./services/pokemon.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PokemonController],
  providers: [
    {
      provide: Services.POKEMON,
      useClass: PokemonService
    }
  ],
  exports: [
    {
      provide: Services.POKEMON,
      useClass: PokemonService
    }
  ]
})
export class PokemonModule {}