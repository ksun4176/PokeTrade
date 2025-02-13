import { Inject, Injectable } from "@nestjs/common";
import { accounts, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";

export interface IAccountService {
  getAccounts(filter?: Prisma.accountsWhereInput): Promise<accounts[]>;
}

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  getAccounts(filter?: Prisma.accountsWhereInput) {
    return this.prisma.accounts.findMany({ where: filter });
  }
}