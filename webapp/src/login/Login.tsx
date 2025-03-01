import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import { CenterGradientContainer } from '../sharedComponents/layouts/CenterGradientContainer';
import { StandaloneCard } from '../sharedComponents/surfaces/StandaloneCard';
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
      navigate('/edit', { replace: true });
    }
  },[account, user, navigate]);

  if (user) {
    return <LoadingOverlay />;
  }
  return (
    <CenterGradientContainer direction="column" justifyContent="space-between">
      <StandaloneCard variant="outlined" sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
        >
          Log in
        </Typography>
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
      </StandaloneCard>
    </CenterGradientContainer>
  );
}
