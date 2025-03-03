import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { SimpleCard } from "./surfaces/SimpleCard";
import { ValidatedTextField } from "./inputs/ValidatedTextField";
import React from "react";
import { Account } from "@prisma/client";
import { createAccount, updateAccountInfo } from "../utils/apis";

export interface AccountInitialDetails {
  /** The new in game name */
  ign: string;
  /** The new friend code */
  friendCode: string;
}
export interface EditAccountState extends AccountInitialDetails {
  /** Whether the in game name is valid */
  ignValid: boolean;
  /** Whether the friend code is valid */
  friendCodeValid: boolean;
}

/**
 * Update old account or create a new account
 * @param oldAccount Old account details OR null if creating a new account
 * @param newAccountDetails New account details to set
 * @returns Saved account details
 */
export async function SaveAccountToDb(oldAccount: Account | null, newAccountDetails: EditAccountState) {
  let newAccount: Account;
  if (oldAccount) {
    const updateAccountInfoResponse = await updateAccountInfo(oldAccount.id, newAccountDetails.ign, newAccountDetails.friendCode);
    newAccount = updateAccountInfoResponse.data;
  }
  else {
    const createAccountResponse = await createAccount(newAccountDetails.ign, newAccountDetails.friendCode);
    newAccount = createAccountResponse.data;
  }
  return newAccount;
}

type EditAccountProps = {
  /**
   * The set state function for all the fields and whether they are valid.
   */
  setAccountDetails: React.Dispatch<React.SetStateAction<EditAccountState>>;
  /**
   * The initial state of the account. This should not be the same state object you will use for setAccountDetails to avoid rerenders.
   */
  initialAccountState?: AccountInitialDetails;
}
/**
 * The card to enter linked account information
 */
export function EditAccount(props: EditAccountProps) {
  const { setAccountDetails, initialAccountState } = props;

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
    setAccountDetails(oldState => ({
      ...oldState,
      ign: value,
      ignValid: isValid
    }))
  }
  const onFriendCodeChange = (value: string, isValid: boolean) => {
    setAccountDetails(oldState => ({
      ...oldState,
      friendCode: value,
      friendCodeValid: isValid
    }))
  }

  return <SimpleCard sx={{ pl: 2, pr: 2 }}>
    <CardHeader title='Account' sx={{ pb: 0 }} />
    <CardContent>
      <ValidatedTextField
        label='In Game Name'
        validator={ignValidator}
        onChange={onIgnChange}
        initialValue={initialAccountState?.ign}
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
        initialValue={initialAccountState?.friendCode}
        textFieldProps={{
          required: true,
          margin: 'dense',
          fullWidth: true,
        }}
      />
    </CardContent>
  </SimpleCard>
}