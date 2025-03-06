import CardContent from "@mui/material/CardContent";
import { AccountDetails } from "../../utils/apis";
import { ValidatedTextField } from "../../sharedComponents/inputs/ValidatedTextField";
import { FriendCodeValidator, IgnValidator } from "../../utils/validators";
import { useCallback, useContext, useRef } from "react";
import { AccountContext } from "../../utils/contexts/AccountContext";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

export type EditAccountState = AccountDetails & {
  /** Whether the in game name is valid */
  inGameNameValid: boolean;
  /** Whether the friend code is valid */
  friendCodeValid: boolean;
}
type AccountEditContentProps = {
  /**
   * The set state function for all the fields and whether they are valid.
   */
  setAccountDetails: React.Dispatch<React.SetStateAction<EditAccountState>>;
  /**
   * This number will be updated every time the reset button is clicked
   */
  resetNum: number;
}
/**
 * The card to enter linked account information
 */
export function AccountEditContent(props: AccountEditContentProps) {
  const { setAccountDetails, resetNum } = props;
  const { account } = useContext(AccountContext);
  const initialAccountDetail = useRef<AccountDetails>({
    inGameName: account?.inGameName ?? '',
    friendCode: account?.friendCode ?? ''
  })

  const onIgnChange = useCallback((value: string, isValid: boolean) => {
    setAccountDetails(oldState => ({
      ...oldState,
      inGameName: value,
      inGameNameValid: isValid
    }))
  }, [setAccountDetails]);
  const onFriendCodeChange = useCallback((value: string, isValid: boolean) => {
    setAccountDetails(oldState => ({
      ...oldState,
      friendCode: value,
      friendCodeValid: isValid
    }))
  }, [setAccountDetails]);

  return <Card key={resetNum} variant="outlined" sx={{
    width: '100%'
  }}>
    <CardContent>
      <Box display='flex' flexDirection='column' alignItems='flex-start'>
        <ValidatedTextField
          label='In Game Name'
          validator={IgnValidator}
          onChange={onIgnChange}
          initialValue={initialAccountDetail.current.inGameName}
          required
          margin='normal'
        />
        <ValidatedTextField
          label='Friend Code'
          validator={FriendCodeValidator}
          onChange={onFriendCodeChange}
          initialValue={initialAccountDetail.current.friendCode}
          required
          margin='normal'
        />
      </Box>
    </CardContent>
  </Card>
}