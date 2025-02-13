import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";
import { Account, accountInclude } from "src/utils/types";

export interface IAccountService {
  getAccounts(filter?: Prisma.accountsWhereInput): Promise<Account[]>;
  updateAccount(accountId: number, accountDetails: Prisma.accountsUpdateInput): Promise<Account>;
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

  async updateAccount(accountId: number, accountDetails: Prisma.accountsUpdateInput) {
    const account = await this.prisma.accounts.update({
      where: {
        id: accountId
      },
      data: {
        in_game_name: accountDetails.in_game_name,
        friend_code: accountDetails.friend_code
      },
      include: accountInclude
    });
    console.log(`Account [${accountId}] was updated.`)
    return account;
  }
}