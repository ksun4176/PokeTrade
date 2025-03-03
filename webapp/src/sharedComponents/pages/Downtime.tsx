import Typography from '@mui/material/Typography';
import { SimpleCard } from '../surfaces/SimpleCard';
import { CenterGradientContainer } from '../layouts/CenterGradientContainer';

/**
 * Page to show when API is down
 */
export default function Downtime() {
  return (
    <CenterGradientContainer direction="column">
      <SimpleCard variant="outlined" sx={{
        p: 4,
        margin: 'auto'
      }}>
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
      </SimpleCard>
    </CenterGradientContainer>
  );
}
