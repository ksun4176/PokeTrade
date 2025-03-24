import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { AccountStatus } from '../../utils/constants';
import CircleIcon from '@mui/icons-material/Circle';
import { postAccountStatusUpdate } from '../../utils/apis';
import { getAccountStatusColor } from '../../utils/utils';

/**
 * Show account information
 */
export default function AccountInfo() {
  const { account, setAccount } = useContext(AccountContext);
  const navigate = useNavigate();

  const editAccount = () => {
    navigate('/accountedit')
  }

  const changeAccountStatus = async () => {
    if (!account) return;
    const newAccount = await postAccountStatusUpdate(account);
    console.log(newAccount);
    setAccount(newAccount);
  };

  return <>
    <Box display='flex' alignItems='center' gap={1}>
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
    <Button
      variant='outlined'
      size='small'
      startIcon={
        <CircleIcon sx={{ color: getAccountStatusColor(account!) }} />
      }
      onClick={changeAccountStatus}
    >
      {account!.status === AccountStatus.Available ? 'Available' : 'Unavailable'}
    </Button>
    <Typography variant="h6">
      {account!.inGameName}
    </Typography>
    <Typography variant="body1">
      {account!.friendCode.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3-$4')}
    </Typography>
  </>
}