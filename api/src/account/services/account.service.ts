import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";
import { Account, accountInclude } from "src/utils/types";

export interface IAccountService {
  getAccounts(filter?: Prisma.accountsWhereInput): Promise<Account[]>;
}

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  getAccounts(filter?: Prisma.accountsWhereInput) {
    return this.prisma.accounts.findMany({ 
      where: filter,
      include: accountInclude
    });
  }
}