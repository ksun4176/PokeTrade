import { styled, alpha } from '@mui/material/styles';
import { AccountCircle } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { JoinDiscordButton } from '../buttons/JoinDiscordButton';
import Badge from '@mui/material/Badge';
import { useContext } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';
import { getAccountStatusColor } from '../../utils/utils';

type Page = {
  /**
   * Caption of page to show in navigation bar
   */
  caption: string;
  /**
   * Relative URL to navigate to
   */
  toUrl: string;
}
const pages: Page[] = [
  {
    caption: 'Home',
    toUrl: '/home'
  }
];

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  backdropFilter: 'blur(24px)',
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '0 12px',
}));

/**
 * Navigation bar to show over all pages
 */
export function MyAppBar() {
  const { account } = useContext(AccountContext);
  const navigate = useNavigate();

  const goToMyAccount = () => {
    navigate('/myaccount');
  }

  const pageClicked = (page: Page) => {
    navigate(page.toUrl);
  }

  return <AppBar
    position="sticky"
    enableColorOnDark
    sx={{
      boxShadow: 0,
      backgroundColor: 'transparent',
    }}
  >
    <StyledToolbar variant="dense" disableGutters>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
        <Typography variant="h6" component="div" mr={2} color='textPrimary'>
          PokéTrade
        </Typography>
        {
          pages.map((page,index) => <Button
            key={index}
            variant='text'
            color='primary'
            size='large'
            onClick={() => pageClicked(page)}
          >
            {page.caption}
          </Button>)
        }
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 0 }}>
        <a href='https://ko-fi.com/O4O71FBM0I' target='_blank'>
          <img
            height='36px'
            style={{
              border: '0px',
              height: '36px',
              marginTop: '4px',
            }}
            src='https://storage.ko-fi.com/cdn/kofi5.png?v=6'
            alt='Buy Me a Coffee at ko-fi.com' />
        </a>
        <JoinDiscordButton isIconButton />
        <IconButton
          size="large"
          aria-label="Go To My Account"
          onClick={goToMyAccount}
        >
          <Badge
            variant='dot'
            overlap='circular'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: getAccountStatusColor(account!)
              }
            }}
          >
            <AccountCircle />
          </Badge>
        </IconButton>
      </Box>
      
    </StyledToolbar>
  </AppBar>
}