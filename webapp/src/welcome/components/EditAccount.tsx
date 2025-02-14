import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import { StandaloneCard } from "../../sharedComponents/StandaloneCard";
import { useCallback } from "react";

export type EditAccountProps = {
  ignState: [string, React.Dispatch<React.SetStateAction<string>>];
  ignErrorState: [string, React.Dispatch<React.SetStateAction<string>>];
  friendCodeState: [string, React.Dispatch<React.SetStateAction<string>>];
  friendCodeErrorState: [string, React.Dispatch<React.SetStateAction<string>>];
}
export function EditAccount(props: EditAccountProps) {
  const { ignState, ignErrorState, friendCodeState, friendCodeErrorState } = props;
  const [ign, setIgn] = ignState;
  const [ignError, setIgnError] = ignErrorState;
  const [friendCode, setFriendCode] = friendCodeState;
  const [friendCodeError, setFriendCodeError] = friendCodeErrorState;

  const updateIgn = useCallback((newIgn: string) => {
    setIgn(newIgn);
    if (newIgn.length === 0) {
      setIgnError('In Game Name is required');
    }
    else {
      setIgnError('');
    }
  },[setIgn, setIgnError]);
  const updateFriendCode = useCallback((newFriendCode: string) => {
    setFriendCode(newFriendCode);
    if (newFriendCode.length === 0) {
      setFriendCodeError('Friend Code is required');
    }
    const friendCodeInt = parseInt(newFriendCode);
    if (isNaN(friendCodeInt)) {
      setFriendCodeError('Friend Code needs to format [0-9]+')
    }
    else {
      setFriendCodeError('');
    }
  },[setFriendCode, setFriendCodeError]);

  return <StandaloneCard sx={{ pl: 2, pr: 2 }}>
    <CardHeader title='Linked Account' sx={{ pb: 0 }} />
    <CardContent
      component='form'
    >
      <TextField
        required
        margin='dense'
        fullWidth
        label='In Game Name'
        value={ign}
        error={!!ignError}
        helperText={ignError}
        onChange={event => updateIgn(event.target.value)}
      />
      <TextField 
        required
        margin='dense'
        fullWidth
        label='Friend Code'
        value={friendCode}
        error={!!friendCodeError}
        helperText={friendCodeError}
        onChange={event => updateFriendCode(event.target.value)}
      />
    </CardContent>
  </StandaloneCard>
}