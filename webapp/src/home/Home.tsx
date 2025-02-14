import Typography from '@mui/material/Typography';
import { StandaloneCard } from '../sharedComponents/StandaloneCard';
import { TopGradientContainer } from '../sharedComponents/TopGradientContainer';

export default function Home() {
  return (
    <TopGradientContainer direction="column">
      <StandaloneCard variant="outlined" sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h2"
        >
          To Be Continued...
        </Typography>
      </StandaloneCard>
    </TopGradientContainer>
  );
}
