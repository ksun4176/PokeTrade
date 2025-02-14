import React, { useContext } from "react";
import { StepContent } from "./StepContent";
import { EditAccount } from "./EditAccount";
import { AccountContext } from "../../utils/contexts/AccountContext";
import { createAccount, updateAccountInfo } from "../../utils/apis";
import { Account } from "../../utils/types";

export interface AccountStepContentProps {
  handleSteps: (isNext: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
export function AccountStepContent(props: AccountStepContentProps) {
  const { handleSteps, isFirstStep, isLastStep } = props;
  
  const { account, updateAccount } = useContext(AccountContext);
  const ignState = React.useState(account?.inGameName ?? '');
  const ignErrorState = React.useState('');
  const friendCodeState = React.useState(account?.friendCode ?? '');
  const friendCodeErrorState = React.useState('');
  const [ign] = ignState;
  const [ignError] = ignErrorState;
  const [friendCode] = friendCodeState;
  const [friendCodeError] = friendCodeErrorState;
  
  const addAccountInfo = async () => {
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
    updateAccount(newAccount);
  };

  return <StepContent
    handleSteps={handleSteps}
    nextStepDisabled={!ign || !friendCode || !!ignError || !!friendCodeError}
    isFirstStep={isFirstStep}
    isLastStep={isLastStep}
    handleNext={addAccountInfo}
  >
    <EditAccount
      ignState={ignState}
      ignErrorState={ignErrorState}
      friendCodeState={friendCodeState}
      friendCodeErrorState={friendCodeErrorState} 
    />
  </StepContent>
}