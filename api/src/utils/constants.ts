export enum Routes {
  AUTH = 'auth',
  USER = 'users',
  POKEMON = 'pokemons',
  TRADE = 'trades',
  ACCOUNT = 'accounts',
  DISCORD = 'discord',
}

export enum Services {
  PRISMA = 'PRISMA_SERVICE',
  AUTH = 'AUTH_SERVICE',
  USER = 'USER_SERVICE',
  POKEMON = 'POKEMON_SERVICE',
  TRADE = 'TRADE_SERVICE',
  ACCOUNT = 'ACCOUNT_SERVICE',
  DISCORD = 'DISCORD_SERVICE',
}

export enum TradeTypes {
  Request = 1,
  Offer = 2,
}

export enum ChannelTypes {
  TradeMessage = 1,
}

export enum AccountStatus {
  Available = 1,
  Unavailable = 2,
  Deactivated = 3,
}

export const DISCORD_BASE_URL = 'https://discord.com/api/v9';