import { useCallback, useContext, useRef, useState } from "react";
import { StepContent } from "./StepContent";
import { EditAccount, EditAccountRef, EditAccountState, SaveAccountToDb } from "../../sharedComponents/EditAccount";
import { AccountContext } from "../../utils/contexts/AccountContext";

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
  const accountDetails = useRef<EditAccountRef>({
    ign: '',
    friendCode: '',
  });
  const [accountValid, setAccountValid] = useState<EditAccountState>({
    ignValid: false,
    friendCodeValid: false
  });
  
  /**
   * Handle stepping through the stepper.
   * On moving on, add account information to the database.
   * @param isNext Whether we are handling moving to the next step or previous step
   */
  const handleStepsWithAddAccount = useCallback(async (isNext: boolean) => {
    if (isNext) {
      const newAccount = await SaveAccountToDb(account, accountDetails.current.ign, accountDetails.current.friendCode);
      setAccount(newAccount);
    }
    handleSteps(isNext);
  }, [account, setAccount, handleSteps]);

  return <StepContent
    handleSteps={handleStepsWithAddAccount}
    nextStepDisabled={!Object.values(accountValid).every(isValid => isValid)}
    isFirstStep={isFirstStep}
    isLastStep={isLastStep}
  >
    <EditAccount
      accountDetails={accountDetails}
      setAccountValid={setAccountValid}
    />
  </StepContent>
}