import { Inject, Injectable } from "@nestjs/common";
import { Account, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";

export interface IAccountService {
  /**
   * Get accounts
   * @param filter Filters for accounts
   * @returns A list of accounts
   */
  getAccounts(filter?: Prisma.AccountWhereInput): Promise<Account[]>;
  /**
   * Update the account
   * @param accountId Account to update
   * @param accountDetails Details to update the account with
   * @returns Updated account
   */
  updateAccount(accountId: number, accountDetails: Prisma.AccountUpdateInput): Promise<Account>;
  /**
   * Create an account linked to a user
   * @param userId User to link account to
   * @param accountDetails Details of account
   * @returns Created account
   */
  createAccount(userId: number, accountDetails: Prisma.AccountUncheckedCreateInput): Promise<Account>;
} 

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  async getAccounts(filter?: Prisma.AccountWhereInput) {
    const accounts = await this.prisma.account.findMany({ where: filter });
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
      }
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
      }
    });
    console.log(`Account [${account.id}] was created.`)
    return account;
  }
}