import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FaDiscord, FaQuestionCircle } from "react-icons/fa";
import { API_URL } from '../utils/constants';
import { CenterGradientContainer } from '../sharedComponents/CenterGradientContainer';
import { StandaloneCard } from '../sharedComponents/StandaloneCard';

export default function LogIn() {
  const login = () => {
    window.location.href = `${API_URL}/auth/login`;
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
            startIcon={<FaDiscord color="5865F2" />}
            onClick={login}
          >
            Log in with Discord
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FaQuestionCircle />}
            href='https://discord.gg/eTJR8VfXPw'
            target='_blank'
          >
            Go to Support Server
          </Button>
          </Box>
      </StandaloneCard>
    </CenterGradientContainer>
  );
}
