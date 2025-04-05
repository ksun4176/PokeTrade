import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Account, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { AccountStatus, Services } from "src/utils/constants";

export interface IAccountService {
  /**
   * Get accounts
   * @param filter Filters for accounts
   * @returns A list of accounts
   */
  getAccounts(filter?: Prisma.AccountWhereInput): Promise<Account[]>;
  /**
   * Update the account status
   * @param account Account to update
   * @param deactivate Whether to deactivate the account
   * @returns Updated account
   */
  updateAccountStatus(account: Account, deactivate?: boolean): Promise<Account>;
  /**
   * Update the account
   * @param account Account to update
   * @param accountDetails Details to update the account with
   * @returns Updated account
   */
  updateAccount(account: Account, accountDetails: Prisma.AccountUpdateInput): Promise<Account>;
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
  
  private isFriendCodeValid(friendCode: string) {
    return /^[0-9]{16}$/.test(friendCode);
  }

  async getAccounts(filter?: Prisma.AccountWhereInput) {
    const accounts = await this.prisma.account.findMany({ where: filter });
    console.log(`${accounts.length} accounts found.`);
    return accounts;
  }

  async updateAccountStatus(account: Account, deactivate?: boolean) {
    const newStatus = deactivate ? AccountStatus.Deactivated 
      : account.status === AccountStatus.Available ? AccountStatus.Unavailable : AccountStatus.Available;
    const newAccount = await this.prisma.account.update({
      where: {
        id: account.id
      },
      data: {
        status: newStatus
      }
    });
    console.log(`Account [${newAccount.id}] status was updated.`)
    return newAccount;
  }

  async updateAccount(account: Account, accountDetails: Prisma.AccountUpdateInput) {
    const { inGameName, friendCode } = accountDetails;
    if (!this.isFriendCodeValid(friendCode as string)) {
      throw new BadRequestException('Friend code must be a 16 digit number');
    }
    const newAccount = await this.prisma.account.update({
      where: {
        id: account.id
      },
      data: {
        inGameName,
        friendCode
      }
    });
    console.log(`Account [${newAccount.id}] was updated.`)
    return newAccount;
  }

  async createAccount(userId: number, accountDetails: Prisma.AccountUncheckedCreateInput) {
    const { inGameName, friendCode } = accountDetails;
    if (!this.isFriendCodeValid(friendCode)) {
      throw new BadRequestException('Friend code must be a 16 digit number');
    }
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