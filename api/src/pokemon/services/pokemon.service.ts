import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";
import { Pokemon, pokemonInclude } from "src/utils/types";

export interface IPokemonService {
  getPokemons(): Promise<Pokemon[]>;
}

@Injectable()
export class PokemonService implements IPokemonService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  async getPokemons() {
    const pokemons = await this.prisma.pokemonCardDex.findMany({ 
      include: pokemonInclude
    });
    console.log(`${pokemons.length} pokemons found.`)
    return pokemons;
  }
}