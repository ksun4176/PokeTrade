import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';

export default function AccountInfo() {
  const { account } = useContext(AccountContext);

  return <>
    <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
      Account
    </Typography>
    <Typography variant="h6">
      {account!.inGameName}
    </Typography>
    <Typography variant="body1">
      {account!.friendCode.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3-$4')}
    </Typography>
  </>
}