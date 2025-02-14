import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";
import { Account, accountInclude } from "src/utils/types";

export interface IAccountService {
  getAccounts(filter?: Prisma.AccountWhereInput): Promise<Account[]>;
  updateAccount(accountId: number, accountDetails: Prisma.AccountUpdateInput): Promise<Account>;
  createAccount(userId: number, accountDetails: Prisma.AccountUncheckedCreateInput): Promise<Account>;
} 

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  async getAccounts(filter?: Prisma.AccountWhereInput) {
    const accounts = await this.prisma.account.findMany({ 
      where: filter,
      include: accountInclude
    });
    console.log(`${accounts.length} accounts found.`);
    return accounts;
  }

  async updateAccount(accountId: number, accountDetails: Prisma.AccountUpdateInput) {
    const { inGameName, friendCode } = accountDetails;
    const account = await this.prisma.account.update({
      where: {
        id: accountId
      },
      data: {
        inGameName,
        friendCode
      },
      include: accountInclude
    });
    console.log(`Account [${accountId}] was updated.`)
    return account;
  }

  async createAccount(userId: number, accountDetails: Prisma.AccountUncheckedCreateInput) {
    const { inGameName, friendCode } = accountDetails;
    const account = await this.prisma.account.create({ 
      data: {
        userId: userId,
        inGameName,
        friendCode
      },
      include: accountInclude
    });
    console.log(`Account [${account.id}] was created.`)
    return account;
  }
}