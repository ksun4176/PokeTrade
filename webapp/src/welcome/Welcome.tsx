import { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AccountContext } from '../utils/contexts/AccountContext';
import { TopGradientContainer } from '../sharedComponents/layouts/TopGradientContainer';
import { useNavigate } from 'react-router-dom';
import { EditAccount, EditAccountState, SaveAccountToDb } from '../sharedComponents/EditAccount';
import { JoinDiscordButton } from '../sharedComponents/buttons/JoinDiscordButton';
import Box from '@mui/material/Box';

export default function Welcome() {
  const { account, setAccount } = useContext(AccountContext);
  const navigate = useNavigate();
  
  const [accountDetails, setAccountDetails] = useState<EditAccountState>({
    ign: '',
    friendCode: '',
    ignValid: false,
    friendCodeValid: false
  });
  const accountValid: Record<string, boolean> = {
    ignValid: accountDetails.ignValid,
    friendCodeValid: accountDetails.friendCodeValid
  }
  
  const saveAccount = async () => {
    const newAccount = await SaveAccountToDb(account, accountDetails);
    setAccount(newAccount);
    navigate('/home');
  }
  console.log(saveAccount);

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
    <EditAccount 
      setAccountDetails={setAccountDetails}
    />
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
