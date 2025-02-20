import Typography from '@mui/material/Typography';
import { StandaloneCard } from './StandaloneCard';
import { CenterGradientContainer } from './CenterGradientContainer';

export default function NotFound() {
  return (
    <CenterGradientContainer direction="column">
      <StandaloneCard variant="outlined" sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h1"
        >
          404 Not Found
        </Typography>
      </StandaloneCard>
    </CenterGradientContainer>
  );
}
