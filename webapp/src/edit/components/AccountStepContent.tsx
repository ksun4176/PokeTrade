import React, { useContext, useEffect } from "react";
import { StepContent } from "./StepContent";
import { EditAccount } from "./EditAccount";
import { AccountContext } from "../../utils/contexts/AccountContext";
import { createAccount, updateAccountInfo } from "../../utils/apis";
import { Account } from "@prisma/client";

export interface AccountStepContentProps {
  /**
   * Handle stepping through the stepper
   * @param isNext Whether we are handling moving to the next step or previous step
   */
  handleSteps: (isNext: boolean) => void;
  /**
   * Whether this is the first step
   */
  isFirstStep?: boolean;
  /**
   * Whether this is the last step
   */
  isLastStep?: boolean;
}
/**
 * The stepper content for entering linked account information
 */
export function AccountStepContent(props: AccountStepContentProps) {
  const { handleSteps, isFirstStep, isLastStep } = props;
  
  const { account, setAccount } = useContext(AccountContext);
  const ignState = React.useState('');
  const ignErrorState = React.useState('');
  const friendCodeState = React.useState('');
  const friendCodeErrorState = React.useState('');
  const [ign, setIgn] = ignState;
  const [ignError] = ignErrorState;
  const [friendCode, setFriendCode] = friendCodeState;
  const [friendCodeError] = friendCodeErrorState;

  useEffect(() => {
    // set the IGN and friend code to the account's information
    setIgn(account?.inGameName ?? '');
    setFriendCode(account?.friendCode ?? '');
  },[account, setIgn, setFriendCode])
  
  /**
   * Handle stepping through the stepper.
   * On moving on, add account information to the database.
   * @param isNext Whether we are handling moving to the next step or previous step
   */
  const handleStepsWithAddAccount = async (isNext: boolean) => {
    if (isNext) {
      let newAccount: Account;
      if (account) {
        const newIgn = ign !== account.inGameName ? ign : undefined;
        const newFriendCode = friendCode !== account.friendCode ? friendCode : undefined;
        const updateAccountInfoResponse = await updateAccountInfo(account.id, newIgn, newFriendCode);
        newAccount = updateAccountInfoResponse.data;
      }
      else {
        const createAccountResponse = await createAccount(ign, friendCode);
        newAccount = createAccountResponse.data;
      }
      setAccount(newAccount);
    }
    handleSteps(isNext);
  };

  return <StepContent
    handleSteps={handleStepsWithAddAccount}
    nextStepDisabled={!ign || !friendCode || !!ignError || !!friendCodeError}
    isFirstStep={isFirstStep}
    isLastStep={isLastStep}
  >
    <EditAccount
      ignState={ignState}
      ignErrorState={ignErrorState}
      friendCodeState={friendCodeState}
      friendCodeErrorState={friendCodeErrorState}
    />
  </StepContent>
}