import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import { CenterGradientContainer } from '../sharedComponents/layouts/CenterGradientContainer';
import { SimpleCard } from '../sharedComponents/surfaces/SimpleCard';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AccountContext } from '../utils/contexts/AccountContext';
import { LoadingOverlay } from '../sharedComponents/pages/LoadingOverlay';
import { JoinDiscordButton } from '../sharedComponents/buttons/JoinDiscordButton';

export default function LogIn() {
  const { user, account } = useContext(AccountContext)
  const login = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/login`;
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (account) {
      navigate('/home', { replace: true });
    }
    else if (user) {
      navigate('/welcome', { replace: true });
    }
  },[account, user, navigate]);

  if (user) {
    return <LoadingOverlay />;
  }
  return (
    <CenterGradientContainer direction="column" justifyContent="space-between">
      <SimpleCard variant="outlined" sx={{
        p: 4,
        margin: 'auto'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={login}
          >
            Log in with Discord
          </Button>
          <JoinDiscordButton />
        </Box>
      </SimpleCard>
      {process.env.REACT_APP_VERSION && <Typography variant='body2' color='text.secondary'>v{process.env.REACT_APP_VERSION}</Typography>}
    </CenterGradientContainer>
  );
}
