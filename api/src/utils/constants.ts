export enum Routes {
  AUTH = 'auth',
  USER = 'users',
  POKEMON = 'pokemons',
  TRADE = 'trades',
  ACCOUNT = 'accounts',
}

export enum Services {
  PRISMA = 'PRISMA_SERVICE',
  AUTH = 'AUTH_SERVICE',
  USER = 'USER_SERVICE',
  POKEMON = 'POKEMON_SERVICE',
  TRADE = 'TRADE_SERVICE',
  ACCOUNT = 'ACCOUNT_SERVICE'
}

export enum TradeTypes {
  Request = 1,
  Offer = 2,
}