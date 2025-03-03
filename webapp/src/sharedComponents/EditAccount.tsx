import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { StandaloneCard } from "./surfaces/StandaloneCard";
import { ValidatedTextField } from "./inputs/ValidatedTextField";
import React from "react";
import { Account } from "@prisma/client";
import { createAccount, updateAccountInfo } from "../utils/apis";

export type EditAccountRef = {
  /** The new in game name */
  ign: string;
  /** The new friend code */
  friendCode: string;
}

export type EditAccountState = {
  /** Whether the in game name is valid */
  ignValid: boolean;
  /** Whether the friend code is valid */
  friendCodeValid: boolean;
}

/**
 * Update old account or create a new account
 * @param oldAccount Old account details OR null if creating a new account
 * @param newIgn In game name to set
 * @param newFriendCode Friend code to set
 * @returns New account details
 */
export async function SaveAccountToDb(oldAccount: Account | null, newIgn: string, newFriendCode: string) {
  let newAccount: Account;
  if (oldAccount) {
    const updateAccountInfoResponse = await updateAccountInfo(oldAccount.id, newIgn, newFriendCode);
    newAccount = updateAccountInfoResponse.data;
  }
  else {
    const createAccountResponse = await createAccount(newIgn, newFriendCode);
    newAccount = createAccountResponse.data;
  }
  return newAccount;
}

type EditAccountProps = {
  /**
   * A ref object on all the fields
   */
  accountDetails: React.RefObject<EditAccountRef>;
  setAccountValid: React.Dispatch<React.SetStateAction<EditAccountState>>;
}
/**
 * The card to enter linked account information
 */
export function EditAccount(props: EditAccountProps) {
  const { accountDetails, setAccountValid } = props;

  const ignValidator = (value: string) => {
    if (value.length === 0) {
      return 'In Game Name is required';
    }
    return '';
  }
  const friendCodeValidator = (value: string) => {
    if (value.length === 0) {
      return 'Friend Code is required';
    }
    else if (!/^[0-9]{16}$/.test(value)) {
      return 'Friend Code needs to be a 16 digit number';
    }
    return '';
  }

  const onIgnChange = (value: string, isValid: boolean) => {
    accountDetails.current.ign = value;
    setAccountValid(oldState => ({
      ...oldState,
      ignValid: isValid
    }))
  }
  const onFriendCodeChange = (value: string, isValid: boolean) => {
    accountDetails.current.friendCode = value;
    setAccountValid(oldState => ({
      ...oldState,
      friendCodeValid: isValid
    }))
  }

  return <StandaloneCard sx={{ pl: 2, pr: 2 }}>
    <CardHeader title='Linked Account' sx={{ pb: 0 }} />
    <CardContent>
      <ValidatedTextField
        label='In Game Name'
        validator={ignValidator}
        onChange={onIgnChange}
        textFieldProps={{
          required: true,
          margin: 'dense',
          fullWidth: true,
        }}
      />
      <ValidatedTextField
        label='Friend Code'
        validator={friendCodeValidator}
        onChange={onFriendCodeChange}
        textFieldProps={{
          required: true,
          margin: 'dense',
          fullWidth: true,
        }}
      />
    </CardContent>
  </StandaloneCard>
}