import { Inject, Injectable } from "@nestjs/common";
import { pokemon_card_dex } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";

export interface IPokemonService {
  getPokemons(): Promise<pokemon_card_dex[]>;
}

@Injectable()
export class PokemonService implements IPokemonService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  getPokemons(): Promise<pokemon_card_dex[]> {
    return this.prisma.pokemon_card_dex.findMany();
  }
}