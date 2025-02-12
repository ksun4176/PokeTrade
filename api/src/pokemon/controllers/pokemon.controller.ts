import { Controller, Get, Inject } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IPokemonService } from "../services/pokemon.service";

@Controller(Routes.POKEMON)
export class PokemonController {
  constructor(
    @Inject(Services.POKEMON) private readonly pokemonService: IPokemonService
  ) { }

  @Get('pokemons')
  getPokemons() {
    return this.pokemonService.getPokemons();
  }
}