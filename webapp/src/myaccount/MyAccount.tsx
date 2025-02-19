import { Pokemon } from '../utils/types';
import { TopGradientContainer } from '../sharedComponents/TopGradientContainer';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AccountInfo from './components/AccountInfo';
import MyList from './components/MyLists';

type MyAccountProps = {
  pokemons: Map<number, Pokemon>;
}
export default function MyAccount(props: MyAccountProps) {
  const { pokemons } = props;

  return <>
    <TopGradientContainer flexDirection='column'>
      <Grid
        container
        sx={{
          height: {
            xs: '100%',
            sm: 'calc(100dvh - var(--template-frame-height, 0px))',
          },
          mt: {
            xs: 4,
            sm: 0,
          },
        }}
      >
        <Grid
          size={{ xs: 12, sm: 3, lg: 2 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'flex-start',
            pt: 8,
            px: 4,
            gap: 4,
          }}
        >
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
            }}
          >
            {
              <AccountInfo />
            }
          </Box>
        </Grid>
        <Grid
          size={{ sm: 12, md: 9, lg: 10 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: 'transparent',
            alignItems: 'flex-start',
            pt: { xs: 0, sm: 6 },
            pb: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 4 },
            gap: 2,
          }}
        >
          <Card sx={{
            display: { xs: 'flex', md: 'none' },
            width: '100%'
          }}>
            <CardContent sx={{
              p: 1,
              ':last-child': {
                p: 1
              }
            }}>
              <AccountInfo />
            </CardContent>
          </Card>
          <MyList pokemons={pokemons}/>
        </Grid>
      </Grid>
    </TopGradientContainer>
  </>
}
