import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";
import { Pokemon } from "src/utils/types";

export interface IPokemonService {
  getPokemons(): Promise<Pokemon[]>;
}

@Injectable()
export class PokemonService implements IPokemonService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  getPokemons() {
    return this.prisma.pokemon_card_dex.findMany({ include: {
      pokemon_postfixes: true,
      expansions: true,
      pokemon_card_rarities: true
    }});
  }
}