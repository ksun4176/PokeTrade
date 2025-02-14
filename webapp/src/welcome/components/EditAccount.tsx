import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import { StandaloneCard } from "../../sharedComponents/StandaloneCard";

export type EditAccountProps = {
  ign: string;
  ignError: string;
  updateIgn: (newIgn: string) => void;
  friendCode: string;
  friendCodeError: string;
  updateFriendCode: (newFriendCode: string) => void;
}
export function EditAccount(props: EditAccountProps) {
  const { ign, ignError, updateIgn, friendCode, friendCodeError, updateFriendCode } = props;

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