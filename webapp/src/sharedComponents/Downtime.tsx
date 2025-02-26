import Typography from '@mui/material/Typography';
import { StandaloneCard } from './StandaloneCard';
import { CenterGradientContainer } from './CenterGradientContainer';

/**
 * Page to show when API is down
 */
export default function Downtime() {
  return (
    <CenterGradientContainer direction="column">
      <StandaloneCard variant="outlined" sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
        >
          App is down...
        </Typography>
        <Typography
          component="p"
          variant="body1"
        >
          Try again later!
        </Typography>
      </StandaloneCard>
    </CenterGradientContainer>
  );
}
