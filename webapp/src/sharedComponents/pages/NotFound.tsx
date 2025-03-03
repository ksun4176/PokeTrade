import Typography from '@mui/material/Typography';
import { SimpleCard } from '../surfaces/SimpleCard';
import { CenterGradientContainer } from '../layouts/CenterGradientContainer';

/**
 * Page to show if invalid route
 */
export default function NotFound() {
  return (
    <CenterGradientContainer direction="column">
      <SimpleCard variant="outlined" sx={{
        p: 4,
        margin: 'auto'
      }}>
        <Typography
          component="h1"
          variant="h1"
        >
          404 Not Found
        </Typography>
      </SimpleCard>
    </CenterGradientContainer>
  );
}
