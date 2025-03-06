import { useCallback, useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AccountContext } from '../utils/contexts/AccountContext';
import { TopGradientContainer } from '../sharedComponents/layouts/TopGradientContainer';
import { useNavigate } from 'react-router-dom';
import { JoinDiscordButton } from '../sharedComponents/buttons/JoinDiscordButton';
import Box from '@mui/material/Box';
import { SaveAccountToDb } from '../utils/apis';
import { SimpleCard } from '../sharedComponents/surfaces/SimpleCard';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { ValidatedTextField } from '../sharedComponents/inputs/ValidatedTextField';
import { FriendCodeValidator, IgnValidator } from '../utils/validators';

export default function Welcome() {
  const { account, setAccount } = useContext(AccountContext);
  const navigate = useNavigate();
  
  const [accountDetails, setAccountDetails] = useState({
    inGameName: '',
    friendCode: '',
    inGameNameValid: false,
    friendCodeValid: false
  });
  const accountValid: Record<string, boolean> = {
    inGameNameValid: accountDetails.inGameNameValid,
    friendCodeValid: accountDetails.friendCodeValid
  }
  
  const saveAccount = async () => {
    const newAccount = await SaveAccountToDb(account, accountDetails);
    setAccount(newAccount);
    navigate('/home');
  }
  
  const onIgnChange = useCallback((value: string, isValid: boolean) => {
    setAccountDetails(oldState => ({
      ...oldState,
      inGameName: value,
      inGameNameValid: isValid
    }))
  },[]);
  const onFriendCodeChange = useCallback((value: string, isValid: boolean) => {
    setAccountDetails(oldState => ({
      ...oldState,
      friendCode: value,
      friendCodeValid: isValid
    }))
  },[]);

  return <TopGradientContainer flexDirection='column' alignItems='center' p={2}>
    <Typography
      variant='h4'
      component="h1"
      textAlign='center'
    >
      Welcome to the PokéTrade!
    </Typography>
    <Typography
      variant='subtitle1'
      component="h2"
      textAlign='center'
    >
      Complete the next few steps to get started.
    </Typography>
    <Box m={2}>
      <JoinDiscordButton />
    </Box>
    <SimpleCard sx={{ pl: 2, pr: 2 }}>
      <CardHeader title='Account' sx={{ pb: 0 }} />
      <CardContent>
        <ValidatedTextField
          label='In Game Name'
          validator={IgnValidator}
          onChange={onIgnChange}
          required
          margin='dense'
          fullWidth
        />
        <ValidatedTextField
          label='Friend Code'
          validator={FriendCodeValidator}
          onChange={onFriendCodeChange}
          required
          margin='dense'
          fullWidth
        />
      </CardContent>
    </SimpleCard>
    <Button
      variant='contained'
      color='success'
      disabled={!Object.values(accountValid).every(isValid => isValid)}
      onClick={() => saveAccount()}
      sx={{
        m: 2
      }}
    >
      Complete
    </Button>
  </TopGradientContainer>
}
