import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

/**
 * Show account information
 */
export default function AccountInfo() {
  const { account } = useContext(AccountContext);
  const navigate = useNavigate();

  const editAccount = () => {
    navigate('/edit', { state: { activeStep: 0 } })
  }

  return <>
    <Box display='flex' alignItems='center'>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
        Account
      </Typography>
      <IconButton
        size='small'
        color='info'
        disableRipple
        onClick={editAccount}
      >
        <EditIcon />
      </IconButton>
    </Box>
    <Typography variant="h6">
      {account!.inGameName}
    </Typography>
    <Typography variant="body1">
      {account!.friendCode.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3-$4')}
    </Typography>
  </>
}