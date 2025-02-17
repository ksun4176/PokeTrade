import Box from "@mui/material/Box";
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography";
import { AccountWithUser } from "../../utils/types";
import Avatar from "@mui/material/Avatar";
import { SxProps } from "@mui/material/styles";
import Button from "@mui/material/Button";

type AccountCardProps = {
  account: AccountWithUser
  cardSx?: SxProps;
}
export default function AccountCard(props: AccountCardProps) {
  const { account, cardSx } = props;
  return <Card sx={{
    display: 'flex',
    pt: 4,
    ...cardSx
  }}>
    <Avatar sx={{ ml: 1, mr: 1 }}>{account.user.username[0]}</Avatar>
    <Box display='flex' flexDirection='column' gap={1}>
      <Typography>{account.user.username} [{account.user.discordId}]</Typography>
      <Button
        size='small'
        variant='outlined'
        onClick={() => navigator.clipboard.writeText(`<@${account.user.discordId}>`)}
      >
        Copy @mention
      </Button>
    </Box>
  </Card>
}