import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";

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

  return <Box
    flex='1 1 auto'
    display='flex'
    flexDirection='column'
    flexWrap='wrap'
    alignContent='center'
    justifyContent='center'
  >
    <Card sx={{ width: 400 }}>
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
    </Card>
  </Box>
}